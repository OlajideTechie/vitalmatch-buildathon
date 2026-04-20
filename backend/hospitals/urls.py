from django.urls import path
from .views import (
    HospitalRegisterView, HospitalLoginView,
    BloodRequestAcceptedDonorsView,
    HospitalBloodRequestListView,
    HospitalBloodRequestDetailView,
    ConfirmDonationView,

)

urlpatterns = [
    path('hospital/register', HospitalRegisterView.as_view(), name='hospital-register'),
    path('hospital/login', HospitalLoginView.as_view(), name='hospital-login'),
    path("hospital/blood-requests", HospitalBloodRequestListView.as_view(), name="hospital-blood-requests"),
    path("hospital/blood-requests/<uuid:request_id>", HospitalBloodRequestDetailView.as_view(), name="hospital-blood-request-detail"),
    path("hospital/blood-requests/<uuid:request_id>/donors", BloodRequestAcceptedDonorsView.as_view(), name="blood-request-affected-donors"),
    path('hospital/confirm-donation', ConfirmDonationView.as_view(), name="hospital-confirm-donation")
]