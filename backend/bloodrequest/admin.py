from django.contrib import admin
from .models import BloodRequest, DonorAcceptance


@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'hospital', 'blood_group', 'genotype', 'required_units', 'fulfilled_units', 'status', 'created_at')
    list_filter = ('status', 'blood_group', 'genotype')
    search_fields = ('hospital__full_name',)


@admin.register(DonorAcceptance)
class DonorAcceptanceAdmin(admin.ModelAdmin):
    list_display = ('public_id', 'donor', 'request', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('donor__full_name', 'public_id')
