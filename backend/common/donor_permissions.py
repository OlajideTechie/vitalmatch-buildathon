from rest_framework.permissions import BasePermission

class IsDonor(BasePermission):
    message = "Only donors can access this endpoint."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "donor"