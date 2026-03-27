from django.urls import path
from .views import DonorRegisterView, DonorLoginView, DonorDashboardView

urlpatterns = [
    path('donor/register', DonorRegisterView.as_view(), name='donor-register'),
    path('donor/login', DonorLoginView.as_view(), name='donor-login'),
    path("donor/requests/dashboard",DonorDashboardView.as_view(), name="donor-dashboard"
)
]