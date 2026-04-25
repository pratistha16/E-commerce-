from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from django.db import connection
from django_tenants.utils import schema_context, tenant_context
from users.models import User
from tenants.models import Client, GlobalSettings, AdminActionLog
from products.models import Product
from orders.models import Order
from vendors.models import VendorProfile
from .serializers import (
    AdminUserSerializer, AdminClientSerializer, AdminProductSerializer,
    AdminOrderSerializer, AdminGlobalSettingsSerializer, AdminActionLogSerializer
)
from .permissions import IsSuperAdmin

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsSuperAdmin]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'username']

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        
        AdminActionLog.objects.create(
            admin=request.user,
            action='TOGGLE_USER_ACTIVE',
            target_model='User',
            target_id=str(user.id),
            details={'new_status': user.is_active},
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        return Response({'status': 'success', 'is_active': user.is_active})

class MerchantManagementViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = AdminClientSerializer
    permission_classes = [IsSuperAdmin]
    filterset_fields = ['is_approved', 'is_active']
    search_fields = ['name', 'schema_name']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        merchant = self.get_object()
        merchant.is_approved = True
        merchant.save()
        
        AdminActionLog.objects.create(
            admin=request.user,
            action='APPROVE_MERCHANT',
            target_model='Client',
            target_id=str(merchant.id),
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        return Response({'status': 'merchant approved'})

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        merchant = self.get_object()
        merchant.is_active = not merchant.is_active
        merchant.save()
        
        AdminActionLog.objects.create(
            admin=request.user,
            action='TOGGLE_MERCHANT_ACTIVE',
            target_model='Client',
            target_id=str(merchant.id),
            details={'new_status': merchant.is_active},
            ip_address=request.META.get('REMOTE_ADDR')
        )
        
        return Response({'status': 'success', 'is_active': merchant.is_active})

class GlobalSettingsViewSet(viewsets.ModelViewSet):
    queryset = GlobalSettings.objects.all()
    serializer_class = AdminGlobalSettingsSerializer
    permission_classes = [IsSuperAdmin]

    def get_object(self):
        obj, created = GlobalSettings.objects.get_or_create(id=1)
        return obj

    def list(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class AdminActionLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdminActionLog.objects.all().order_by('-created_at')
    serializer_class = AdminActionLogSerializer
    permission_classes = [IsSuperAdmin]
    filterset_fields = ['admin', 'action', 'target_model']

class CrossTenantManagementViewSet(viewsets.ViewSet):
    permission_classes = [IsSuperAdmin]

    @action(detail=False, methods=['get'])
    def products(self, request):
        all_products = []
        clients = Client.objects.filter(is_active=True, is_approved=True)
        for client in clients:
            with schema_context(client.schema_name):
                products = Product.objects.all()
                serializer = AdminProductSerializer(products, many=True)
                data = serializer.data
                for item in data:
                    item['tenant_id'] = client.id
                    item['tenant_name'] = client.name
                all_products.extend(data)
        return Response(all_products)

    @action(detail=False, methods=['get'])
    def orders(self, request):
        all_orders = []
        clients = Client.objects.filter(is_active=True, is_approved=True)
        for client in clients:
            with schema_context(client.schema_name):
                orders = Order.objects.all().order_by('-created_at')
                serializer = AdminOrderSerializer(orders, many=True)
                data = serializer.data
                for item in data:
                    item['tenant_id'] = client.id
                    item['tenant_name'] = client.name
                all_orders.extend(data)
        return Response(all_orders)

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        total_users = User.objects.count()
        total_merchants = Client.objects.count()
        total_sales = 0
        revenue_over_time = []
        
        # Aggregating sales from all tenants
        clients = Client.objects.filter(is_active=True, is_approved=True)
        for client in clients:
            with schema_context(client.schema_name):
                sales = Order.objects.filter(payment_status='PAID').aggregate(total=Sum('total_amount'))['total'] or 0
                total_sales += float(sales)
                
                # Simple revenue over time (last 7 days)
                for i in range(7):
                    date = timezone.now().date() - timedelta(days=i)
                    daily_sales = Order.objects.filter(
                        payment_status='PAID', 
                        created_at__date=date
                    ).aggregate(total=Sum('total_amount'))['total'] or 0
                    
                    # Update or add to revenue_over_time list
                    found = False
                    for entry in revenue_over_time:
                        if entry['date'] == str(date):
                            entry['revenue'] += float(daily_sales)
                            found = True
                            break
                    if not found:
                        revenue_over_time.append({'date': str(date), 'revenue': float(daily_sales)})

        return Response({
            'total_users': total_users,
            'total_merchants': total_merchants,
            'total_sales': total_sales,
            'revenue_over_time': sorted(revenue_over_time, key=lambda x: x['date']),
            'growth_rate': '15%', # Placeholder
        })
