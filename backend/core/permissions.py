from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """
    Allows access only to platform owners (Super Admins).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')

class IsStaffAdmin(permissions.BasePermission):
    """
    Allows access to both Super Admins and Staff Admins.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'STAFF'])

class IsVendor(permissions.BasePermission):
    """
    Allows access only to merchants (Vendors).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'VENDOR')

class IsCustomer(permissions.BasePermission):
    """
    Allows access only to customers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'CUSTOMER')

class IsTenantOwner(permissions.BasePermission):
    """
    Check if the user is the owner of the tenant profile being accessed.
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False
