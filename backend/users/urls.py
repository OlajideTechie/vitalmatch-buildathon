from django.urls import path
from .views import LogoutView, ProfileView

urlpatterns = [
    path("logout", LogoutView.as_view(), name="logout"),
    path("profile", ProfileView.as_view(), name="profile"),
]