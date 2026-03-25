from donors.models import DonorProfile
from math import radians, sin, cos, sqrt, atan2


 # Distance calculation
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)

    a = sin(d_lat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c


# Scoring engine
def calculate_score(distance, donor):
    reward_score = donor.reward_points * 0.2
    reliability_score = donor.successful_donation * 0.3

    return distance - reward_score - reliability_score



# Reason generator
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



 # Main matching function
def match_donors(blood_request):
    donors = DonorProfile.objects.filter(
        blood_group=blood_request.blood_group,
        genotype=blood_request.genotype,
        is_available=True
    )

    results = []

    for donor in donors:
        distance = haversine(
            blood_request.hospital.latitude,
            blood_request.hospital.longitude,
            donor.latitude,
            donor.longitude
        )

        score = calculate_score(distance, donor)

        results.append({
            "donor": donor,
            "score": score,
            "distance": round(distance, 2),
            "reason": generate_reason(distance, donor)
        })

    # sort by best score
    results.sort(key=lambda x: x["score"])

    limit = blood_request.required_units + 2  # buffer

    return results[:limit]