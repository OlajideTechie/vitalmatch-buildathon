from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from notifications.models import Notification
from .serializers import NotificationSerializer
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema

class NotificationPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

@extend_schema(tags=["Notification"])
class NotificationsView(APIView):
    """
    Return notifications for logged-in user (hospital or donor)
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications_qs = Notification.objects.filter(user=request.user).order_by('-created_at')
        paginator = NotificationPagination()
        paginated = paginator.paginate_queryset(notifications_qs, request)
        serializer = NotificationSerializer(paginated, many=True)
        return paginator.get_paginated_response(serializer.data)