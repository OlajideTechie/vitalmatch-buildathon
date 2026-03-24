from django.db import models
from hospitals.models import HospitalProfile
from donors.models import DonorProfile
import uuid


class BloodRequest(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('partial', 'Partial'),
        ('completed', 'Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    hospital = models.ForeignKey(HospitalProfile, on_delete=models.CASCADE)

    blood_group = models.CharField(max_length=5)
    genotype = models.CharField(max_length=2)

    required_units = models.IntegerField()
    fulfilled_units = models.IntegerField(default=0)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    created_at = models.DateTimeField(auto_now_add=True)


class DonorAcceptance(models.Model):
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('confirmed', 'Confirmed'),
        ('not_needed', 'Not Needed'),
    ]

    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE)
    request = models.ForeignKey(BloodRequest, on_delete=models.CASCADE)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='accepted')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['donor', 'request']