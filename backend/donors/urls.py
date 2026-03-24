from django.urls import path
from .views import DonorRegisterView, DonorLoginView

urlpatterns = [
    path('donor/register', DonorRegisterView.as_view(), name='donor-register'),
    path('donor/login', DonorLoginView.as_view(), name='donor-login'),
]