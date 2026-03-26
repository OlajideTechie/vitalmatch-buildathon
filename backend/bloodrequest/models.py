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

    last_retry_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-update status based on fulfilled_units before saving
        if self.fulfilled_units == 0:
            self.status = "open"
        elif self.fulfilled_units < self.required_units:
            self.status = "partial"
        else:
            self.status = "completed"

        super().save(*args, **kwargs) 
    
    def __str__(self):
        return f"{self.hospital.name} - {self.blood_group} ({self.status})"


class DonorAcceptance(models.Model):
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('confirmed', 'Confirmed'),
        ('ignored', 'Ignored'),
    ]

    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE)
    request = models.ForeignKey(BloodRequest, on_delete=models.CASCADE)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='accepted')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['donor', 'request']