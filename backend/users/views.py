from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema
from .serializers import DonorProfileSerializer, HospitalProfileSerializer, LogoutSerializer

@extend_schema(tags=["Logout"])
class LogoutView(APIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh_token = serializer.validated_data["refresh"]

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=200)
        except Exception:
            return Response({"error": "Invalid token"}, status=400)


@extend_schema(tags=["Profile"])
class ProfileView(APIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if hasattr(user, "donorprofile"):
            serializer = DonorProfileSerializer(user.donorprofile)
            data = serializer.data
            data["role"] = "donor"
        elif hasattr(user, "hospitalprofile"):
            serializer = HospitalProfileSerializer(user.hospitalprofile)
            data = serializer.data
            data["role"] = "hospital"
        else:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(data, status=status.HTTP_200_OK)