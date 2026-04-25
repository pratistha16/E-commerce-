from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserManagementViewSet, MerchantManagementViewSet, GlobalSettingsViewSet,
    AdminActionLogViewSet, CrossTenantManagementViewSet
)

router = DefaultRouter()
router.register(r'users', UserManagementViewSet, basename='admin-users')
router.register(r'merchants', MerchantManagementViewSet, basename='admin-merchants')
router.register(r'settings', GlobalSettingsViewSet, basename='admin-settings')
router.register(r'audit-logs', AdminActionLogViewSet, basename='admin-audit-logs')
router.register(r'cross-tenant', CrossTenantManagementViewSet, basename='admin-cross-tenant')

urlpatterns = [
    path('', include(router.urls)),
]
