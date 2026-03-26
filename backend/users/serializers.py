from rest_framework import serializers
from .models import User
from donors.models import DonorProfile
from hospitals.models import HospitalProfile
from bloodrequest.models import BloodRequest, DonorAcceptance

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
    dashboard = serializers.SerializerMethodField()

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
            'dashboard',
        ]

    def get_dashboard(self, obj):
        """
        Calculate accepted, confirmed, and pending donation requests for the donor.
        """
        accepted_counts = DonorAcceptance.objects.filter(donor=obj, status="accepted").count()

        confirmed_counts = DonorAcceptance.objects.filter(donor=obj, status="confirmed").count()

        # Pending: all blood requests that match donor's blood_group & genotype,
        # minus those that already have a DonorAcceptance record
        matched_requests = BloodRequest.objects.filter(
            blood_group=obj.blood_group,
            genotype=obj.genotype,
        )

        pending_counts =  matched_requests.exclude(
            donoracceptance__donor=obj
        ).count()

        return {
            "accepted_requests": accepted_counts,
            "confirmed_requests": confirmed_counts,
            "pending_requests": pending_counts,
        }


class HospitalProfileSerializer(serializers.ModelSerializer):
    location = LocationSerializer(source='*')
    dashboard = serializers.SerializerMethodField()

    class Meta:
        model = HospitalProfile
        fields = [
            'full_name',
            'phone_number',
            'hospital_type',
            'is_verified',
            'location',
            'dashboard',
        ]

    def get_dashboard(self, obj):
        total = BloodRequest.objects.filter(hospital=obj).count()
        open_req = BloodRequest.objects.filter(hospital=obj, status="open").count()
        partial = BloodRequest.objects.filter(hospital=obj, status="partial").count()
        completed = BloodRequest.objects.filter(hospital=obj, status="completed").count()

        return {
            "total_requests": total,
            "open_requests": open_req,
            "partial_requests": partial,
            "completed_requests": completed,
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(
        required=True,
        help_text="Refresh token to be blacklisted during logout"
    )

    def validate_refresh(self, value):
        if not value:
            raise serializers.ValidationError("Refresh token is required")
        return value