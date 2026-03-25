from rest_framework import serializers
from .models import BloodRequest, DonorAcceptance


class BloodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodRequest
        fields = '__all__'
        read_only_fields  = [
            "hospital",
            "fulfilled_units",
            "status"
        ]

class BloodRequestProgressSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = BloodRequest
        fields = [
            'id',
            'blood_group', 
            'genotype', 
            'required_units', 
            'fulfilled_units', 
            'status', 
            'progress_percentage', 
            'created_at'
            ]

    def get_progress_percentage(self, obj):
        return round(obj.fulfilled_units / obj.required_units) * 100 if obj.required_units else 0


class DonorAcceptanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorAcceptance
        fields = '__all__'
        