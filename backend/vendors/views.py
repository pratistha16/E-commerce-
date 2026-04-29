import os
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

    @action(detail=False, methods=['get', 'patch'], url_path='settings')
    def profile_settings(self, request):
        # Use unfiltered_objects to avoid tenant-filtering issues during profile retrieval
        profile, created = VendorProfile.unfiltered_objects.get_or_create(user=request.user)

        # Ensure profile is linked to the current tenant if it's not already
        from core.tenant_context import get_tenant
        tenant = get_tenant()
        if tenant and (not profile.tenant_id or profile.tenant_id != str(tenant.id)):
            profile.tenant_id = str(tenant.id)
            profile.save()

        if request.method == 'PATCH':
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def public_details(self, request):
        from core.tenant_context import get_tenant
        tenant = get_tenant()
        if not tenant:
            return Response({'error': 'No tenant context found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Find the vendor profile associated with this tenant
        profile = VendorProfile.unfiltered_objects.filter(tenant_id=str(tenant.id)).first()
        if not profile:
            return Response({'error': 'Vendor profile not found for this tenant'}, status=status.HTTP_404_NOT_FOUND)
            
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
        try:
            vendor = VendorProfile.objects.get(user=self.request.user)
            return Product.objects.filter(vendor=vendor)
        except VendorProfile.DoesNotExist:
            return Product.objects.none()

    def perform_create(self, serializer):
        vendor, _ = VendorProfile.objects.get_or_create(user=self.request.user)
        serializer.save(vendor=vendor)

    @action(detail=True, methods=['post'], url_path='upload-image')
    def upload_image(self, request, pk=None):
        product = self.get_object()
        image_file = request.FILES.get('image')
        
        print(f"DEBUG: Received image upload request for product {product.id}")
        if not image_file:
            print("DEBUG: No image file in request.FILES")
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"DEBUG: Image file name: {image_file.name}, size: {image_file.size}")
        
        # Ensure media directory exists
        from django.conf import settings
        media_path = os.path.join(settings.MEDIA_ROOT, 'products')
        if not os.path.exists(media_path):
            os.makedirs(media_path, exist_ok=True)
            print(f"DEBUG: Created directory {media_path}")

        from products.models import ProductImage
        is_primary = not product.images.exists()
        
        img_obj = ProductImage(
            product=product,
            is_primary=is_primary
        )
        # Explicitly save the file to ensure it's written to MEDIA_ROOT
        img_obj.image.save(image_file.name, image_file, save=True)
        
        print(f"DEBUG: Created ProductImage object {img_obj.id}, path: {img_obj.image.path}")
        
        return Response({'status': 'Image uploaded successfully', 'id': img_obj.id}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        try:
            vendor = VendorProfile.objects.get(user=request.user)
        except VendorProfile.DoesNotExist:
            return Response({'error': 'Vendor profile not found'}, status=status.HTTP_404_NOT_FOUND)

        total_products = Product.objects.filter(vendor=vendor).count()
        total_orders = Order.objects.filter(vendor=vendor).count()
        delivered_orders = Order.objects.filter(vendor=vendor, status='DELIVERED')
        total_revenue = delivered_orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0

        daily_revenue = delivered_orders.annotate(day=TruncDay('created_at')) \
            .values('day') \
            .annotate(revenue=Sum('total_amount')) \
            .order_by('day')

        monthly_revenue = delivered_orders.annotate(month=TruncMonth('created_at')) \
            .values('month') \
            .annotate(revenue=Sum('total_amount')) \
            .order_by('month')

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
