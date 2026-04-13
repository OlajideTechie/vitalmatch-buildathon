from django.contrib import admin
from .models import DonorProfile


@admin.register(DonorProfile)
class DonorProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'blood_group', 'genotype', 'is_available', 'is_verified', 'reward_points', 'successful_donation')
    list_filter = ('blood_group', 'genotype', 'is_available', 'is_verified', 'gender')
    search_fields = ('full_name', 'email', 'phone_number', 'nin')
