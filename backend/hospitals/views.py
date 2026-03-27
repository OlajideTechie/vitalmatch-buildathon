from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from datetime import datetime, timezone
from common.hospital_permissions import IsHospital
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from donors.models import DonorProfile
from notifications.models import Notification
from bloodrequest.models import DonorAcceptance

from .serializers import ( 
    HospitalRegisterSerializer, HospitalLoginSerializer,
    HospitalProfileFullSerializer, HospitalProfileLoginSerializer,
    ConfirmDonationSerializer
)

from bloodrequest.serializers import (
    BloodRequestProgressSerializer,
    BloodRequestSerializer, DonorInfoSerializer
)

from drf_spectacular.utils import extend_schema
from .models import HospitalProfile
from bloodrequest.models import BloodRequest


@extend_schema(tags=["Hospitals"])
class HospitalRegisterView(APIView):
    serializer_class = HospitalRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = HospitalRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access = AccessToken.for_user(user) 

            expires_in = datetime.fromtimestamp(access['exp'], tz=timezone.utc) - datetime.now(timezone.utc)

            profile = HospitalProfile.objects.filter(user=user).first()
            profile_data = HospitalProfileFullSerializer(profile).data if profile else None

            return Response({
                "message": "Hospital registered successfully",
                "api_message": getattr(user, "api_message", ""),
                "access_token": str(access),
                "refresh_token": str(refresh),
                "expires_in": int(expires_in.total_seconds()),
                "user_profile": {
                        "id": user.id,
                        "email": user.email,
                        "role": getattr(user, "role", "")
                    },
                "hospital_profile": profile_data,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=["Hospitals"])
class HospitalLoginView(APIView):
    serializer_class = HospitalLoginSerializer
    permission_classes = [permissions.AllowAny]
    """
    Log in a Hospital user and return JWT tokens.
    """

    def post(self, request):
        serializer = HospitalLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(request, email=email, password=password)

            if user is not None:
                # Generate JWT token pair
                refresh_token = RefreshToken.for_user(user)
                access_token = AccessToken.for_user(user) 

                expires_in = datetime.fromtimestamp(access_token['exp'], tz=timezone.utc) - datetime.now(timezone.utc)

                profile = HospitalProfile.objects.filter(user=user).first()
                profile_data = HospitalProfileLoginSerializer(profile).data if profile else None


                return Response({
                    "message": "Login successful",
                    "access_token": str(access_token),
                    "refresh_token": str(refresh_token),
                    "expires_in": int(expires_in.total_seconds()),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "profile_data": profile_data,
                        "role": getattr(user, "role", "")
                    }
                }, status=status.HTTP_200_OK)

            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

"""
List all blood requests for a hospital
"""
@extend_schema(
    tags=["Hospitals"]
)
class HospitalBloodRequestListView(APIView):
    permission_classes = [IsAuthenticated, IsHospital]

    def get(self, request):
        hospital = request.user.hospitalprofile
        blood_requests = BloodRequest.objects.filter(hospital=hospital).order_by('-created_at')
        data = [
            {
                "id": br.id,
                "blood_group": br.blood_group,
                "genotype": br.genotype,
                "required_units": br.required_units,
                "fulfilled_units": br.fulfilled_units,
                "status": br.status,
                "created_at": br.created_at,
            } 
            for br in blood_requests
        ]
        return Response(data, status=status.HTTP_200_OK)

    

"""
View single request details (status & progress)
"""
@extend_schema(
    tags=["Hospitals"]
)
class HospitalBloodRequestDetailView(APIView):
    serializer_class = BloodRequestProgressSerializer
    permission_classes = [IsAuthenticated, IsHospital]

    def get(self, request, request_id=None):
        hospital = request.user.hospitalprofile
        
        if request_id:
            # Detail view: single request
            blood_request = get_object_or_404(BloodRequest, id=request_id, hospital=hospital)
            serializer = self.serializer_class(blood_request)

        else:
            # List view: all requests for this hospital
            blood_requests = BloodRequest.objects.filter(hospital=hospital).order_by('-created_at')
            serializer = self.serializer_class(blood_requests, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


"""
View Accepted donors for a request
"""
@extend_schema(
    tags=["Hospitals"]
)
class BloodRequestAccepteddDonorsView(APIView):
    serializer_class = DonorInfoSerializer
    permission_classes = [IsAuthenticated, IsHospital]

    class DonorPagination(PageNumberPagination):
        page_size = 10 
        page_size_query_param = 'page_size'
        max_page_size = 50

    def get(self, request, request_id):
        hospital = request.user.hospitalprofile
        blood_request = get_object_or_404(BloodRequest, id=request_id, hospital=hospital)
        
        # Filter donors dynamically
        donors_qs = DonorProfile.objects.filter(
            is_available=True,
            blood_group=blood_request.blood_group,
            genotype=blood_request.genotype
        )

        paginator = self.DonorPagination()
        paginated_donors = paginator.paginate_queryset(donors_qs, request)

        data = [
            {
                "full_name": donor.full_name,
                "email": donor.user.email,
                "phone_number": donor.phone_number,
                "blood_group": donor.blood_group,
                "genotype": donor.genotype,
            } for donor in paginated_donors
        ]

        return paginator.get_paginated_response(data)
    


"""
Confirm Donors who have successfully donated
"""
@extend_schema(
    tags=["Hospitals"]
)
class ConfirmDonationView(APIView):
    """
    Hospital confirms that a donor's blood donation has been completed.
    Donor is set back to available, rewarded, and a notification is sent.
    """
    serializer_class = ConfirmDonationSerializer
    permission_classes = [IsAuthenticated, IsHospital]

    def post(self, request):
            try:
                hospital = HospitalProfile.objects.get(user=request.user)
            except HospitalProfile.DoesNotExist:
                return Response(
                    {"error": "Hospital profile not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            acceptance_id = request.data.get("acceptance_id")
            if not acceptance_id:
                return Response({"error": "acceptance_id is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch DonorAcceptance record using public_id (UUID)
            try:
                acceptance = DonorAcceptance.objects.select_related(
                    "donor", "request"
                ).get(public_id=acceptance_id)
            except DonorAcceptance.DoesNotExist:
                return Response(
                    {"error": "Donor acceptance record not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            blood_request = acceptance.request

            # Ensure hospital owns the blood request
            if blood_request.hospital != hospital:
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

            # Prevent over-confirmation
            if blood_request.fulfilled_units >= blood_request.required_units:
                return Response({"error": "Request already completed"}, status=status.HTTP_400_BAD_REQUEST)

            # Update acceptance status to confirmed
            acceptance.status = "confirmed"
            acceptance.save(update_fields=["status"])

            # Update blood request fulfillment and status
            blood_request.fulfilled_units += 1
            if blood_request.fulfilled_units >= blood_request.required_units:
                blood_request.status = "completed"
            else:
                blood_request.status = "open"
            blood_request.save(update_fields=["fulfilled_units", "status"])

            # Update donor stats
            donor = acceptance.donor
            donor.reward_points += 1
            donor.successful_donation += 1
            donor.is_available = True  # Donor is back online
            donor.save(update_fields=["reward_points", "successful_donation", "is_available"])

            # Notify donor
            Notification.objects.create(
                user=donor.user,
                title="Donation Confirmed",
                message=f"Your donation for request {blood_request.id} has been confirmed. Thank you!"
            )

            return Response({
                "message": "Donation confirmed",
                "status": blood_request.status,
                "fulfilled_units": blood_request.fulfilled_units,
                "donor_status": acceptance.status
            }, status=status.HTTP_200_OK)