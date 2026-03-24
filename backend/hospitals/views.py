from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from datetime import datetime, timezone

from .serializers import ( 
    HospitalRegisterSerializer, HospitalLoginSerializer,
    HospitalProfileFullSerializer, HospitalProfileLoginSerializer
)

from drf_spectacular.utils import extend_schema
from .models import HospitalProfile


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