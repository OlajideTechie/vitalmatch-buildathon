from rest_framework import serializers
from django.contrib.auth import get_user_model
from donors.models import DonorProfile
from bloodrequest.models import DonorAcceptance
from services.verification import verify_nin
from django.utils.timesince import timesince

import re



User = get_user_model()


class DonorRegisterSerializer(serializers.Serializer):

    full_name = serializers.CharField(max_length=255)
    phone_number = serializers.CharField(required=False, allow_blank=True, max_length=15)
    email = serializers.EmailField()

    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    nin = serializers.CharField(max_length=20)
    gender = serializers.ChoiceField(choices=['male', 'female', 'other'])

    blood_group = serializers.ChoiceField(choices=['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    genotype = serializers.ChoiceField(choices=['AA', 'AS', 'SS', 'AC', 'SC'])
    has_donated_before = serializers.BooleanField()

    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)

    def validate_full_name(self, value):
        # Check only letters and spaces
        if not re.match(r'^[A-Za-z ]+$', value):
            raise serializers.ValidationError("Full name must contain only letters and spaces")
        return value.title()
    
    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")
        if not re.search(r'[A-Za-z]', value) or not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one letter and one number")
        return value
    
    def validate(self, data):
        """Check that password and confirm_password match"""
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Password and confirm password do not match"})
        return data
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists")
        return value

    def validate_phone_number(self, value):
        if value:
            # Check phone format
            if not re.match(r'^\+?\d{7,15}$', value):
                raise serializers.ValidationError("Phone number must contain 7-15 digits, optional + prefix")
            # Check uniqueness
            if DonorProfile.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError("This phone number is already registered")
        return value
    def validate_phone(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("A user with this phonenumber already exists")
        return value

    def validate_nin(self, value):
        if not value.strip():
            raise serializers.ValidationError("NIN cannot be empty")
        return value.upper()

    def validate_latitude(self, value):
        if not (-90 <= value <= 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        return value

    def validate_longitude(self, value):
        if not (-180 <= value <= 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        return value

    def create(self, validated_data):
        # Verify NIN
        if not verify_nin(validated_data['nin']):
            raise serializers.ValidationError("Invalid NIN")

        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='donor'
        )

        # Create profile
        DonorProfile.objects.create(
            user=user,
            full_name=validated_data['full_name'],
            phone_number=validated_data['phone_number'],
            email=validated_data['email'],
            nin=validated_data['nin'],
            gender=validated_data['gender'],
            blood_group=validated_data['blood_group'],
            genotype=validated_data['genotype'],
            has_donated_before=validated_data['has_donated_before'],
            latitude=validated_data['latitude'],
            longitude=validated_data['longitude'],
            is_verified=True,
            is_available=True
        )

        return user
    

class DonorLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# Full serializer for registration
class DonorProfileFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorProfile
        fields = '__all__' 

# Partial serializer for login
class DonorProfileLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorProfile
        fields = [
            'full_name',
            'is_verified',
            'is_available'
        ]
    

class DonorDashboardSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source="request.hospital.full_name")
    blood_group = serializers.CharField(source="request.blood_group")
    genotype = serializers.CharField(source="request.genotype")
    created_at = serializers.DateTimeField(source="request.created_at")
    request_id = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = DonorAcceptance
        fields = [
            "id",
            "request_id"
            "hospital_name",
            "blood_group",
            "genotype",
            "status",
            "created_at",
            "time_ago"
        ]    

    def get_time_ago(self, obj):
        created_at = obj.request.created_at
        return timesince(created_at).split(",")[0] + " ago"