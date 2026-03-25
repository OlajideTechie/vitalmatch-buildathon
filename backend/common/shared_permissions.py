from rest_framework.permissions import BasePermission

class IsDonorOrHospital(BasePermission):
    message = "Only donors or hospitals can access this endpoint."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["donor", "hospital"]