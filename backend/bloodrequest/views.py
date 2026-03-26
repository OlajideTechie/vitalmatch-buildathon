from services.matching import match_donors

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from common.hospital_permissions import IsHospital
from common.donor_permissions import IsDonor

from .models import HospitalProfile, BloodRequest, DonorAcceptance, DonorProfile
from .serializers import ( 
    BloodRequestSerializer,
    BloodRequestProgressSerializer,
    RetryMatchSerializer
)
from services.matching import match_donors
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

    def post(self, request):
        hospital = HospitalProfile.objects.get(user=request.user)

        serializer = BloodRequestSerializer(data=request.data)
        if serializer.is_valid():
            blood_request = serializer.save(hospital=hospital)

            # Find matching donors
            matched = match_donors(blood_request)

            # Notify matched donors
            for match in matched:
                donor = match["donor"]
                if donor.is_available:  # only notify available donors
                    Notification.objects.create(
                        user=donor.user,
                        title="New Blood Request",
                        message=(
                            f"A hospital has requested {blood_request.blood_group} blood "
                            f"with genotype {blood_request.genotype} near your location."
                        )
                    )

            return Response({
                "request_id": blood_request.id,
                "status": blood_request.status,
                "matches": [
                    {
                        "donor_id": item["donor"].id,
                        "distance_km": round(item["distance"], 2),
                        "reason": item["reason"]
                    }
                    for item in matched
                ]
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

    MAX_RADIUS_KM = 20
    INITIAL_RADIUS_KM = 5
    RADIUS_INCREMENT_KM = 5
    COOLDOWN_SECONDS = 60 

    def post(self, request, request_id):
        try:
            hospital = HospitalProfile.objects.get(user=request.user)
            blood_request = BloodRequest.objects.get(id=request_id, hospital=hospital)
        except HospitalProfile.DoesNotExist:
            return Response(
                {"error": "Hospital profile not found for this user."},
                status=status.HTTP_404_NOT_FOUND
            )
        except BloodRequest.DoesNotExist:
            return Response(
                {"error": "Blood request not found or you do not have permission."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if blood_request.status == "completed":
            return Response({"message": "Blood request already fulfilled."}, status=400)
        

         # Cooldown check for hospital retry again
        if blood_request.last_retry_at:
            time_diff = timezone.now() - blood_request.last_retry_at
            if time_diff < timedelta(seconds=self.COOLDOWN_SECONDS):
                remaining = self.COOLDOWN_SECONDS - time_diff.seconds
                return Response({
                    "message": "Please wait before retrying.",
                    "retry_after_seconds": remaining
                }, status=429)

        radius = self.INITIAL_RADIUS_KM
        matches = []

        while radius <= self.MAX_RADIUS_KM:
            matches = match_donors(blood_request, search_radius_km=radius)
            if matches:
                break
            radius += self.RADIUS_INCREMENT_KM

        if not matches:
            return Response(
                {"message": "Still no donors available. Please try again later."},
                status=status.HTTP_200_OK
            )

        # Serialize matches using RetryMatchSerializer
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

        return Response(
            {
                "request_id": blood_request.id,
                "matches": serializer.data
            },
            status=status.HTTP_200_OK
        )


@extend_schema(
    request=None,
    tags=["Donors"]
)
class DonorAcceptRequestView(APIView):
    """
    Allows a donor to accept a blood request.
    Notifies the hospital when a donor accepts.
    Temporarily marks donor as unavailable.
    """
    permission_classes = [IsAuthenticated, IsDonor]

    def post(self, request, request_id):
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

        # Check if donor already accepted
        if DonorAcceptance.objects.filter(donor=donor, request=blood_request).exists():
            return Response({"error": "You have already accepted this request"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark donor as unavailable once request has been accepted
        donor.is_available = False
        donor.save()

        # Create acceptance record
        acceptance = DonorAcceptance.objects.create(
            donor=donor,
            request=blood_request,
            status="accepted"  # to be confirmed by hospital
        )

        # Notify hospital
        Notification.objects.create(
            user=blood_request.hospital.user,
            title="Blood Request Accepted",
            message=f"Donor {donor.full_name} has accepted your blood request for {blood_request.blood_group} ({blood_request.genotype})."
        )

        return Response({
            "message": "You have successfully accepted the blood request",
            "acceptance_id": acceptance.id,
            "status": acceptance.status
        }, status=status.HTTP_201_CREATED)