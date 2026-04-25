from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MerchantProductViewSet, VendorProfileViewSet, MerchantOrderViewSet

router = DefaultRouter()
router.register(r'products', MerchantProductViewSet, basename='merchant-products')
router.register(r'profile', VendorProfileViewSet, basename='merchant-profile')
router.register(r'orders', MerchantOrderViewSet, basename='merchant-orders')

urlpatterns = [
    path('', include(router.urls)),
]
