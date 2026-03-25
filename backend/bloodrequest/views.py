from services.matching import match_donors

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from common.hospital_permissions import IsHospital
from .models import HospitalProfile, BloodRequest
from .serializers import ( 
    BloodRequestSerializer,
    BloodRequestProgressSerializer
)
from services.matching import match_donors
from drf_spectacular.utils import extend_schema

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
    