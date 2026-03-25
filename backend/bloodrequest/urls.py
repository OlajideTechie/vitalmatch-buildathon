from django.urls import path
from .views import CreateRequestView

urlpatterns = [
    path('hospital/create-request', CreateRequestView.as_view(), name='create-request')
]