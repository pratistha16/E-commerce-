from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum
from products.models import Product
from products.serializers import ProductDetailSerializer
from orders.models import Order
from .models import VendorProfile
from .serializers import VendorProfileSerializer
from core.permissions import IsVendor

class VendorProfileViewSet(viewsets.ModelViewSet):
    serializer_class = VendorProfileSerializer
    permission_classes = (IsVendor,)

    def get_queryset(self):
        return VendorProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get', 'patch'])
    def settings(self, request):
        profile, created = VendorProfile.objects.get_or_create(user=request.user)

        if request.method == 'PATCH':
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(profile)
        return Response(serializer.data)

from orders.serializers import MerchantOrderSerializer

class MerchantOrderViewSet(viewsets.ModelViewSet):
    serializer_class = MerchantOrderSerializer
    permission_classes = (IsVendor,)

    def get_queryset(self):
        try:
            vendor = VendorProfile.objects.get(user=self.request.user)
            return Order.objects.filter(vendor=vendor)
        except VendorProfile.DoesNotExist:
            return Order.objects.none()

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
            return Response({'status': 'Order status updated'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

from django.db.models.functions import TruncDay, TruncMonth
from django.db.models import Count, Sum, F

class MerchantProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductDetailSerializer
    permission_classes = (IsVendor,)

    def get_queryset(self):
        # Only products belonging to the logged-in vendor
        try:
            vendor = VendorProfile.objects.get(user=self.request.user)
            return Product.objects.filter(vendor=vendor)
        except VendorProfile.DoesNotExist:
            return Product.objects.none()

    def perform_create(self, serializer):
        try:
            vendor, _ = VendorProfile.objects.get_or_create(user=self.request.user)
            serializer.save(vendor=vendor)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        try:
            vendor = VendorProfile.objects.get(user=request.user)
        except VendorProfile.DoesNotExist:
            return Response({'error': 'Vendor profile not found'}, status=status.HTTP_404_NOT_FOUND)

        # Basic Stats
        total_products = Product.objects.filter(vendor=vendor).count()
        total_orders = Order.objects.filter(vendor=vendor).count()
        delivered_orders = Order.objects.filter(vendor=vendor, status='DELIVERED')
        total_revenue = delivered_orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0

        # Revenue Charts (Daily)
        daily_revenue = delivered_orders.annotate(day=TruncDay('created_at')) \
            .values('day') \
            .annotate(revenue=Sum('total_amount')) \
            .order_by('day')

        # Revenue Charts (Monthly)
        monthly_revenue = delivered_orders.annotate(month=TruncMonth('created_at')) \
            .values('month') \
            .annotate(revenue=Sum('total_amount')) \
            .order_by('month')

        # Top Selling Products
        from orders.models import OrderItem
        top_selling = OrderItem.objects.filter(order__vendor=vendor, order__status='DELIVERED') \
            .values('product__name') \
            .annotate(total_sold=Sum('quantity'), revenue=Sum(F('quantity') * F('price'))) \
            .order_by('-total_sold')[:5]

        return Response({
            'stats': {
                'total_products': total_products,
                'total_orders': total_orders,
                'total_revenue': total_revenue,
            },
            'charts': {
                'daily_revenue': daily_revenue,
                'monthly_revenue': monthly_revenue,
            },
            'top_selling': top_selling
        })
