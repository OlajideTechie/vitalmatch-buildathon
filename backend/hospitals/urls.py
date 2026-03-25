from django.urls import path
from .views import (
    HospitalRegisterView, HospitalLoginView,
    BloodRequestAccepteddDonorsView,
    HospitalBloodRequestListView,
    HospitalBloodRequestDetailView,

)

urlpatterns = [
    path('hospital/register', HospitalRegisterView.as_view(), name='hospital-register'),
    path('hospital/login', HospitalLoginView.as_view(), name='hospital-login'),
    path("hospital/blood-requests/", HospitalBloodRequestListView.as_view(), name="hospital-blood-requests"),
    path("hospital/blood-requests/<uuid:request_id>/", HospitalBloodRequestDetailView.as_view(), name="hospital-blood-request-detail"),
    path("hospital/blood-requests/<uuid:request_id>/donors/", BloodRequestAccepteddDonorsView.as_view(), name="blood-request-affected-donors"),
]