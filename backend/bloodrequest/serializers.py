from rest_framework import serializers
from .models import BloodRequest, DonorAcceptance


VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
VALID_GENOTYPES = ['AA', 'AS']


class BloodRequestSerializer(serializers.ModelSerializer):
    blood_group = serializers.ChoiceField(choices=VALID_BLOOD_GROUPS)
    genotype = serializers.ChoiceField(choices=VALID_GENOTYPES)

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
        return round((obj.fulfilled_units / obj.required_units) * 100) if obj.required_units else 0


class DonorAcceptanceSerializer(serializers.ModelSerializer):
     ACTION_CHOICES = [
        ('accept', 'Accept the blood request'),
        ('ignore', 'Ignore the blood request'),
    ]
     action = serializers.ChoiceField(choices=ACTION_CHOICES, required=True)

     class Meta:
        model = DonorAcceptance
        fields = ['id', 'donor', 'request', 'status', 'action']
        read_only_fields = ['id', 'donor', 'request', 'status']


class DonorInfoSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    email = serializers.EmailField()
    phone_number = serializers.CharField()
    blood_group = serializers.CharField()
    genotype = serializers.CharField()


class UpdateBloodRequestSerializer(serializers.Serializer):
    additional_units = serializers.IntegerField(min_value=1)


class RetryMatchSerializer(serializers.Serializer):
    donor_id = serializers.UUIDField()
    distance_km = serializers.FloatField()
    reason = serializers.CharField()