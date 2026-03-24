from rest_framework import serializers
from .models import BloodRequest, DonorAcceptance



class BloodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodRequest
        fields = '__all__'


class DonorAcceptanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorAcceptance
        fields = '__all__'
        