from django.db import models
from users.models import User
import uuid


class DonorProfile(models.Model):
    GENDER = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]

    BLOOD_GROUPS = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('O+', 'O+'), ('O-', 'O-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
    ]

    GENOTYPES = [
        ('AA', 'AA'),
        ('AS', 'AS'),
        ('SS', 'SS'),
        ('AC', 'AC'),
        ('SC', 'SC'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=255)

    phone_number = models.CharField(max_length=20)
    email = models.EmailField()

    nin = models.CharField(max_length=20)
    gender = models.CharField(max_length=10, choices=GENDER)

    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUPS, db_index=True)
    genotype = models.CharField(max_length=2, choices=GENOTYPES, db_index=True)

    has_donated_before = models.BooleanField(default=False)

    latitude = models.FloatField()
    longitude = models.FloatField()

    reward_points = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)

    is_available = models.BooleanField(default=True, db_index=True)

    successful_donation = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username