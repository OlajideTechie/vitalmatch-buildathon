from donors.models import DonorProfile
from bloodrequest.models import DonorAcceptance
from haversine import haversine, Unit

def calculate_score(distance, donor):
    reward_score = donor.reward_points * 0.2
    reliability_score = donor.successful_donation * 0.3
    return distance - reward_score - reliability_score

def generate_reason(distance, donor):
    reasons = []
    if distance < 5:
        reasons.append("very close proximity")
    elif distance < 15:
        reasons.append("close proximity")
    if donor.reward_points > 3:
        reasons.append("active donor")
    if donor.successful_donation > 2:
        reasons.append("reliable donation history")
    if not reasons:
        reasons.append("compatible match")
    return ", ".join(reasons)

def match_donors(blood_request, search_radius_km=10):
    """
    Match donors for a blood request within a given radius.
    Returns a list of dicts: donor, score, distance, reason
    """
    if blood_request.status == "completed":
        return [], "Request already completed."

    # Already processed donors
    excluded_ids = DonorAcceptance.objects.filter(
        request=blood_request
    ).values_list("donor_id", flat=True)

    donors = DonorProfile.objects.filter(
        blood_group=blood_request.blood_group,
        genotype=blood_request.genotype,
        is_available=True
    ).exclude(id__in=excluded_ids)

    results = []

    for donor in donors:
        distance = haversine(
            (blood_request.hospital.latitude, blood_request.hospital.longitude),
            (donor.latitude, donor.longitude),
            unit=Unit.KILOMETERS
        )
        if distance > search_radius_km:
            continue

        results.append({
            "donor": donor,
            "score": calculate_score(distance, donor),
            "distance": round(distance, 2),
            "reason": generate_reason(distance, donor)
        })

    # Sort by score ascending
    results.sort(key=lambda x: x["score"])

    # Limit results (required_units + buffer)
    limit = blood_request.required_units + 2
    results = results[:limit]

    # Create pending records
    for item in results:
        DonorAcceptance.objects.get_or_create(
            donor=item["donor"],
            request=blood_request,
            defaults={"status": "pending"}
        )

    if results:
        return results, None
    else:
        return [], f"No donors found within {search_radius_km} km."