import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from donors.models import DonorProfile

User = get_user_model()

BASE_LAT = 6.5244
BASE_LNG = 3.3792

blood_groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
genotypes = ["AA", "AS", "SS", "AC", "SC"]

def generate_nearby_location():
    return (
        BASE_LAT + random.uniform(-0.05, 0.05),
        BASE_LNG + random.uniform(-0.05, 0.05)
    )

class Command(BaseCommand):
    help = "Seed test donors"

    def handle(self, *args, **kwargs):
        for i in range(10):
            lat, lng = generate_nearby_location()

            user = User.objects.create_user(
                email=f"donor{i}@test.com",
                password="test1234",
                role="donor"
            )

            DonorProfile.objects.create(
                user=user,
                full_name=f"Test Donor {i}",
                phone_number=f"080000000{i}",
                blood_group=random.choice(blood_groups),
                genotype=random.choice(genotypes),
                latitude=lat,
                longitude=lng,
                is_available=True,
                reward_points=random.randint(0, 10),
                successful_donation=random.randint(0, 5)
            )

        self.stdout.write(self.style.SUCCESS("✅ 10 donors created successfully"))