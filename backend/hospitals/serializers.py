from rest_framework import serializers
from django.contrib.auth import get_user_model
from hospitals.models import HospitalProfile
from services.verification import InterswitchClient
from django.conf import settings
import re
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


class HospitalRegisterSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    full_name = serializers.CharField()
    rc_number = serializers.CharField()
    phone_number = serializers.CharField()
    hospital_type = serializers.ChoiceField(choices=['government', 'private'])

    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True) 

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists")
        return value

    def validate_phone_number(self, value):
        if value:
            if not re.match(r'^\+?\d{7,15}$', value):
                raise serializers.ValidationError("Phone number must contain 7-15 digits, optional + prefix")
            if HospitalProfile.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError("This phone number is already registered")
        return value

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

    def validate_latitude(self, value):
        if not (-90 <= value <= 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        return value

    def validate_longitude(self, value):
        if not (-180 <= value <= 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        return value

    def create(self, validated_data):
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='hospital'
        )

          # Initialize Interswitch client
        client = InterswitchClient()
        api_message = "CAC verification attempted"

        try:
            client = InterswitchClient()
            token = client.authenticate()
            
            # Use sandbox test name for companyName
            company_name = settings.INTERSWITCH_SANDBOX_TEST_NAME

            result = client.verify_cac(token, company_name)
            logger.info(f"Interswitch CAC verification response: {result}")


        except Exception as exc:
            api_message = f"CAC verification attempt failed: {str(exc)}"

        # Create hospital profile — mark verified regardless of API response
        HospitalProfile.objects.create(
            user=user,
            full_name=validated_data['full_name'],
            rc_number=validated_data['rc_number'],
            phone_number=validated_data['phone_number'],
            hospital_type=validated_data['hospital_type'],
            latitude=validated_data['latitude'],
            longitude=validated_data['longitude'],
            is_verified=True
        )
        
         # Add API message to response
        user.api_message = api_message 

        return user


class HospitalLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# Full serializer for registration
class HospitalProfileFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = HospitalProfile
        fields = '__all__'


# Partial serializer for login
class HospitalProfileLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = HospitalProfile
        fields = [
            'full_name',
            'hospital_type',
            'is_verified'
        ]


class ConfirmDonationSerializer(serializers.Serializer):
    acceptance_id = serializers.UUIDField(
        required=True, help_text="ID of the donor acceptance to confirm"
    )