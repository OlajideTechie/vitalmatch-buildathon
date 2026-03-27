from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from datetime import datetime, timezone
from .models import DonorProfile
from bloodrequest.models import BloodRequest, DonorAcceptance
from rest_framework.permissions import IsAuthenticated
from services.matching import haversine
from django.utils.timesince import timesince
from common.donor_permissions import IsDonor
from django.utils import timezone



from .serializers import (
    DonorRegisterSerializer, DonorLoginSerializer,
    DonorProfileFullSerializer, DonorProfileLoginSerializer,
    DonorDashboardSerializer
)
from drf_spectacular.utils import extend_schema


@extend_schema(
    tags=["Donors"]
)
class DonorRegisterView(APIView):
    serializer_class = DonorRegisterSerializer
    permission_classes = [permissions.AllowAny]
    """
    Register a hospital user and return JWT tokens to auto-login.
    """
    def post(self, request):
        serializer = DonorRegisterSerializer(data=request.data)
        if serializer.is_valid():

            user = serializer.save()

            # Generate JWT token pair
            refresh = RefreshToken.for_user(user)
            access = AccessToken.for_user(user)

            expires_in = datetime.fromtimestamp(access['exp'], tz=timezone.utc) - datetime.now(timezone.utc)

            profile = DonorProfile.objects.filter(user=user).first()
            profile_data = DonorProfileFullSerializer(profile).data if profile else None

            return Response({
                "message": "Donor registered successfully",
                "access_token": str(access),
                "refresh_token": str(refresh),
                "expires_in": int(expires_in.total_seconds()),
                "user_profile": {
                        "id": user.id,
                        "email": user.email,
                        "role": getattr(user, "role", "")
                    },
                "donor_profile": profile_data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Donors"]
)
class DonorLoginView(APIView):
    serializer_class = DonorLoginSerializer
    permission_classes = [permissions.AllowAny]
    """
    Log in a Donor user and return JWT tokens.
    """
    def post(self, request):
        serializer = DonorLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(request, email=email, password=password)
            
            if user is not None:
                # Generate JWT token pair
                refresh_token = RefreshToken.for_user(user)
                access_token = AccessToken.for_user(user) 

                expires_in = datetime.fromtimestamp(access_token.payload['exp']) - datetime.now()

                profile = DonorProfile.objects.filter(user=user).first()
                profile_data = DonorProfileLoginSerializer(profile).data if profile else None

                return Response({
                    "message": "Login successful",
                    "access_token": str(access_token),
                    "refresh": str(refresh_token),
                    'expires_in': expires_in.total_seconds(),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "profile_data": profile_data,
                        "role": getattr(user, "role", "")
                    }
                }, status=status.HTTP_200_OK)
            
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Donors"]
)
class DonorDashboardView(APIView):
    serializer_class = DonorDashboardSerializer
    permission_classes = [IsAuthenticated, IsDonor]

    def get(self, request):
        donor = request.user.donorprofile

        # INCOMING → Pending (not yet accepted or ignored Donations)
        matched_requests = BloodRequest.objects.filter(
            blood_group=donor.blood_group,
            genotype=donor.genotype,
            status="open"  # optional depending on your model
        )

        acted_request_ids = DonorAcceptance.objects.filter(
            donor=donor
        ).values_list("request_id", flat=True)

        incoming_requests = DonorAcceptance.objects.filter(
            donor=request.user.donorprofile,  # the logged-in donor
            status="pending"
        ).select_related("request__hospital").order_by("-created_at")

        # ACTIVE → Accepted Donations
        active_requests = DonorAcceptance.objects.filter(
            donor=donor,
            status="accepted"
        ).select_related("request__hospital").order_by("-created_at")

        # COMPLETED → Confirmed Donations
        completed_requests = DonorAcceptance.objects.filter(
            donor=donor,
            status="confirmed"
        ).select_related("request__hospital").order_by("-created_at")

        return Response({
            "incoming_requests": [
                {
                    "request_id": r.id,
                    "hospital_name": r.request.hospital.full_name,
                    "blood_group": r.request.blood_group,
                    "genotype": r.request.genotype,
                    "status": r.status,
                   
            "time_ago": timesince(r.created_at, timezone.now()) + " ago"
        } 
            for r in incoming_requests
            ],
            
            "active_requests": DonorDashboardSerializer(active_requests, many=True).data,
            "completed_requests": DonorDashboardSerializer(completed_requests, many=True).data,
        })