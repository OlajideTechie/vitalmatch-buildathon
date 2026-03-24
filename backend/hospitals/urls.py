from django.urls import path
from .views import HospitalRegisterView, HospitalLoginView

urlpatterns = [
    path('hospital/register', HospitalRegisterView.as_view(), name='hospital-register'),
    path('hospital/login', HospitalLoginView.as_view(), name='hospital-login'),
]