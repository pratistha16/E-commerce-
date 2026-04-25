from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, DomainViewSet, SystemAnalyticsView, GlobalSettingsViewSet, CrossTenantModerationView, AdminActionLogViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'domains', DomainViewSet, basename='domain')
router.register(r'settings', GlobalSettingsViewSet, basename='settings')
router.register(r'audit-logs', AdminActionLogViewSet, basename='audit-logs')

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', SystemAnalyticsView.as_view(), name='system_analytics'),
    path('analytics/export/', SystemAnalyticsView.as_view(), name='export_analytics'),
    path('moderation/', CrossTenantModerationView.as_view(), name='moderation'),
]
