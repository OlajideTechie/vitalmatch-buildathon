from services.matching import match_donors

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from common.hospital_permissions import IsHospital
from common.donor_permissions import IsDonor

from .models import HospitalProfile, BloodRequest, DonorAcceptance, DonorProfile
from .serializers import ( 
    BloodRequestSerializer,
    DonorAcceptanceSerializer,
    RetryMatchSerializer
)
from services.matching import match_donors
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import status
from notifications.models import Notification

from django.utils import timezone
from datetime import timedelta


@extend_schema(
    tags=["Hospitals"]
)
class CreateRequestView(APIView):
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated, IsHospital]

    INITIAL_RADIUS_KM = 5
    MAX_RADIUS_KM = 500
    RADIUS_INCREMENT_KM = 50

    def post(self, request):
        try:
            hospital = HospitalProfile.objects.get(user=request.user)
        except HospitalProfile.DoesNotExist:
            return Response({"error": "Hospital profile not found"}, status=404)

        serializer = BloodRequestSerializer(data=request.data)
        if serializer.is_valid():
            blood_request = serializer.save(hospital=hospital)

            # Dynamic radius expansion
            radius = self.INITIAL_RADIUS_KM
            matches = []
            message = None

            while radius <= self.MAX_RADIUS_KM:
                matches, message = match_donors(blood_request, search_radius_km=radius)
                if matches:
                    break
                radius += self.RADIUS_INCREMENT_KM

            if not matches:
                return Response({
                    "request_id": blood_request.id,
                    "message": message
                }, status=200)

            # Notify donors
            for match in matches:
                donor = match["donor"]
                if donor.is_available:
                    Notification.objects.create(
                        user=donor.user,
                        title="New Blood Request",
                        message=f"A hospital has requested {blood_request.blood_group} blood "
                                f"with genotype {blood_request.genotype} near your location."
                    )

            # Serialize matches
            match_serializer = RetryMatchSerializer(
                [
                    {
                        "donor_id": m["donor"].id,
                        "distance_km": round(m["distance"], 2),
                        "reason": m["reason"]
                    } for m in matches
                ],
                many=True
            )

            return Response({
                "request_id": blood_request.id,
                "status": blood_request.status,
                "matches": match_serializer.data
            }, status=201)

        return Response(serializer.errors, status=400)
    
@extend_schema(
    request=None,
    tags=["Hospitals"]
)
class RetryMatchView(APIView):
    """
    Retry donor matching for a specific blood request.
    Only accessible by the hospital that owns the request.
    """
    serializer_class = RetryMatchSerializer
    permission_classes = [IsAuthenticated, IsHospital]

    MAX_RADIUS_KM = 5
    INITIAL_RADIUS_KM = 500
    RADIUS_INCREMENT_KM = 50
    COOLDOWN_SECONDS = 60

    def post(self, request, request_id):
        try:
            hospital = HospitalProfile.objects.get(user=request.user)
            blood_request = BloodRequest.objects.get(id=request_id, hospital=hospital)
        except HospitalProfile.DoesNotExist:
            return Response({"error": "Hospital profile not found."}, status=404)
        except BloodRequest.DoesNotExist:
            return Response({"error": "Blood request not found."}, status=404)

        # Prevent retry if already completed
        if blood_request.status == "completed":
            return Response(
                {"message": "Blood request already fulfilled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cooldown check
        if blood_request.last_retry_at:
            time_diff = timezone.now() - blood_request.last_retry_at
            if time_diff < timedelta(seconds=self.COOLDOWN_SECONDS):
                remaining = self.COOLDOWN_SECONDS - time_diff.seconds
                return Response({
                    "message": "Please wait before retrying.",
                    "retry_after_seconds": remaining
                }, status=429)

        # Update retry timestamp
        blood_request.last_retry_at = timezone.now()
        blood_request.save(update_fields=["last_retry_at"])

        # Dynamic radius expansion
        radius = self.INITIAL_RADIUS_KM
        matches = []
        message = None

        while radius <= self.MAX_RADIUS_KM:
            matches, message = match_donors(
                blood_request,
                search_radius_km=radius
            )

            if matches:
                break

            radius += self.RADIUS_INCREMENT_KM

        # No matches found
        if not matches:
            return Response({
                "request_id": blood_request.id,
                "message": message or "No donors available. Try again later."
            }, status=status.HTTP_200_OK)

        # Notify matched donors
        for match in matches:
            donor = match["donor"]
            if donor.is_available:
                Notification.objects.create(
                    user=donor.user,
                    title="New Blood Request",
                    message=(
                        f"A hospital has requested {blood_request.blood_group} blood "
                        f"with genotype {blood_request.genotype} near your location."
                    )
                )

        # Serialize matches (including last_donation if needed)
        serializer = self.serializer_class(
            [
                {
                    "donor_id": m["donor"].id,
                    "distance_km": round(m["distance"], 2),
                    "reason": m["reason"]
                }
                for m in matches
            ],
            many=True
        )

        return Response({
            "request_id": blood_request.id,
            "matches": serializer.data
        }, status=status.HTTP_200_OK)
    

@extend_schema(
    request=DonorAcceptanceSerializer,
    responses={201: OpenApiTypes.OBJECT},
    tags=["Donors"]
)
class DonorAcceptRequestView(APIView):

    """
        Accept or ignore a blood request.
        Request body can contain:
        {
            "action": "accept"  or "ignore"
        }
    """
    permission_classes = [IsAuthenticated, IsDonor]

    def post(self, request, request_id):
        # Validate action
        serializer = DonorAcceptanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action = serializer.validated_data["action"]

        # Get donor profile
        try:
            donor = DonorProfile.objects.get(user=request.user)
        except DonorProfile.DoesNotExist:
            return Response({"error": "Donor profile not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get blood request
        try:
            blood_request = BloodRequest.objects.get(id=request_id)
        except BloodRequest.DoesNotExist:
            return Response({"error": "Blood request not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check for existing donor acceptance record
        existing = DonorAcceptance.objects.filter(donor=donor, request=blood_request).first()

        if existing:
            if existing.status in ["accepted", "ignored"]:
                return Response(
                    {"error": f"You have already {existing.status} this request"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # If status is "pending", allow the donor to accept

        if action == "accept":
            # Mark donor as unavailable
            donor.is_available = False
            donor.save()

            # Update existing pending record or create new acceptance
            if existing and existing.status == "pending":
                existing.status = "accepted"
                existing.save()
                acceptance = existing
            else:
                acceptance = DonorAcceptance.objects.create(
                    donor=donor,
                    request=blood_request,
                    status="accepted"
                )

            # Notify hospital
            Notification.objects.create(
                user=blood_request.hospital.user,
                title="Blood Request Accepted",
                message=f"Donor {donor.full_name} has accepted your blood request "
                        f"for {blood_request.blood_group} ({blood_request.genotype})."
            )

            return Response({
                "message": "Blood request accepted successfully",
                "acceptance_id": acceptance.id,
                "status": acceptance.status
            }, status=status.HTTP_201_CREATED)

        elif action == "ignore":
            # Update existing pending record or create new ignored record
            if existing and existing.status == "pending":
                existing.status = "ignored"
                existing.save()
            else:
                DonorAcceptance.objects.create(
                    donor=donor,
                    request=blood_request,
                    status="ignored"
                )

            # Donor remains available
            donor.is_available = True
            donor.save()

            return Response({
                "message": "You have ignored this blood request and it will no longer appear in your list",
                "status": "ignored"
            }, status=status.HTTP_200_OK)

        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)