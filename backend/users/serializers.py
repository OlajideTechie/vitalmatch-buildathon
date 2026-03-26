from rest_framework import serializers
from .models import User
from donors.models import DonorProfile
from hospitals.models import HospitalProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    

class LocationSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()


class DonorProfileSerializer(serializers.ModelSerializer):
    location = LocationSerializer(source='*')

    class Meta:
        model = DonorProfile
        fields = [
            'full_name',
            'phone_number',
            'blood_group',
            'genotype',
            'is_available',
            'reward_points',
            'successful_donation',
            'location',
        ]


class HospitalProfileSerializer(serializers.ModelSerializer):
    location = LocationSerializer(source='*') 

    class Meta:
        model = HospitalProfile
        fields = [
            'full_name',
            'phone_number',
            'hospital_type',
            'is_verified',
            'location',
        ]

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(
        required=True,
        help_text="Refresh token to be blacklisted during logout"
    )

    def validate_refresh(self, value):
        if not value:
            raise serializers.ValidationError("Refresh token is required")
        return value