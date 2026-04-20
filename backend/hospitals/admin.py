from django.contrib import admin
from .models import HospitalProfile


@admin.register(HospitalProfile)
class HospitalProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'rc_number', 'hospital_type', 'is_verified')
    list_filter = ('hospital_type', 'is_verified')
    search_fields = ('full_name', 'rc_number', 'phone_number')
