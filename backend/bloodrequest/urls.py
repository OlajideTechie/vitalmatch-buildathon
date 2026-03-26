from django.urls import path
from .views import CreateRequestView, RetryMatchView, DonorAcceptRequestView

urlpatterns = [
    path('hospital/create-request', CreateRequestView.as_view(), name='create-request'),
    path(
        "hospital/blood-requests/<uuid:request_id>/retry-matching",
        RetryMatchView.as_view(),
        name="hospital-blood-request-retry-match"
    ),
    path(
        "donor/requests/<uuid:request_id>/respond",
        DonorAcceptRequestView.as_view(),
        name="donor-request-respond"
    ),
]