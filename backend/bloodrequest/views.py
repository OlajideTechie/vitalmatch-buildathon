from services.matching import match_donors

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from common.hospital_permissions import IsHospital
from .models import HospitalProfile, BloodRequest
from .serializers import ( 
    BloodRequestSerializer,
    BloodRequestProgressSerializer,
    RetryMatchSerializer
)
from services.matching import match_donors
from drf_spectacular.utils import extend_schema
from rest_framework import status

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

            matched = match_donors(blood_request)

            return Response({
                "request_id": blood_request.id,
                "status": blood_request.status,
                "matches": [
                    {
                        "donor_id": item["donor"].id,
                        "distance_km": item["distance"],
                        "reason": item["reason"]
                    }
                    for item in matched
                ]
            })

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

    def post(self, request, request_id):
        try:
            hospital = HospitalProfile.objects.get(user=request.user)
        except HospitalProfile.DoesNotExist:
            return Response(
                {"error": "Hospital profile not found for this user."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            blood_request = BloodRequest.objects.get(id=request_id, hospital=hospital)
        except BloodRequest.DoesNotExist:
            return Response(
                {"error": "Blood request not found or you do not have permission."},
                status=status.HTTP_404_NOT_FOUND
            )

        matches = match_donors(blood_request)

        if not matches:
            return Response(
                {"message": "No donors found. Try again later."},
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