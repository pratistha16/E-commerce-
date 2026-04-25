from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MerchantProductViewSet, VendorProfileViewSet, MerchantOrderViewSet

router = DefaultRouter()
router.register(r'merchant/products', MerchantProductViewSet, basename='merchant-products')
router.register(r'merchant/profile', VendorProfileViewSet, basename='merchant-profile')
router.register(r'merchant/orders', MerchantOrderViewSet, basename='merchant-orders')

urlpatterns = [
    path('', include(router.urls)),
]
