from django.db import models
from users.models import User
import uuid

class HospitalProfile(models.Model):
    HOSPITAL_TYPE = [
        ('government', 'Government'),
        ('private', 'Private'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=255)

    rc_number = models.CharField(max_length=15)

    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)

    hospital_type = models.CharField(max_length=20, choices=HOSPITAL_TYPE)

    latitude = models.FloatField()
    longitude = models.FloatField()

    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name