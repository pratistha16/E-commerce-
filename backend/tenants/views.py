from rest_framework import viewsets, permissions, views
from rest_framework.response import Response
from .models import Client, Domain, GlobalSettings, AdminActionLog
from .serializers import ClientSerializer, DomainSerializer, GlobalSettingsSerializer, AdminActionLogSerializer
from core.permissions import IsSuperAdmin, IsStaffAdmin
from core.utils import log_admin_action, notify_admins
from users.models import User
from products.models import Product
from products.serializers import ProductDetailSerializer
from orders.models import Order
from orders.serializers import OrderSerializer
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django_tenants.utils import tenant_context
from rest_framework.decorators import action
import csv
from django.http import HttpResponse

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.exclude(schema_name='public').prefetch_related('domains').order_by('-created_on')
    serializer_class = ClientSerializer
    permission_classes = [IsStaffAdmin]
    search_fields = ['name', 'schema_name']
    ordering_fields = ['created_on', 'name']

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'approve', 'toggle_active']:
            return [IsSuperAdmin()]
        return [IsStaffAdmin()]

    def perform_create(self, serializer):
        client = serializer.save()
        log_admin_action(self.request, 'CREATE_TENANT', 'Client', client.id, {'name': client.name})
        notify_admins(
            title="New Merchant Signup",
            message=f"A new merchant '{client.name}' has signed up and is awaiting approval.",
            notification_type='SYSTEM'
        )

    def perform_destroy(self, instance):
        client_id = instance.id
        client_name = instance.name
        log_admin_action(self.request, 'DELETE_TENANT', 'Client', client_id, {'name': client_name})
        instance.delete()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        client = self.get_object()
        client.is_approved = True
        client.save()
        log_admin_action(request, 'APPROVE_TENANT', 'Client', client.id)
        return Response({'status': 'Merchant account approved'})

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        client = self.get_object()
        client.is_active = not client.is_active
        client.save()
        status_msg = "activated" if client.is_active else "suspended"
        log_admin_action(request, 'TOGGLE_TENANT_STATUS', 'Client', client.id, {'status': status_msg})
        return Response({'status': f'Merchant account {status_msg}', 'is_active': client.is_active})

class AdminActionLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdminActionLog.objects.select_related('admin').all().order_by('-created_at')
    serializer_class = AdminActionLogSerializer
    permission_classes = [IsStaffAdmin]
    filterset_fields = ['admin', 'action', 'target_model']
    search_fields = ['action', 'details', 'admin__username']

class GlobalSettingsViewSet(viewsets.ModelViewSet):
    queryset = GlobalSettings.objects.all()
    serializer_class = GlobalSettingsSerializer
    permission_classes = [IsSuperAdmin] # Only Super Admin can change global fees

    def get_object(self):
        obj, _ = GlobalSettings.objects.get_or_create(id=1)
        return obj

    @action(detail=False, methods=['get', 'patch'])
    def current(self, request):
        settings = self.get_object()
        if request.method == 'PATCH':
            serializer = self.get_serializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                log_admin_action(request, 'UPDATE_GLOBAL_SETTINGS', 'GlobalSettings', 1, request.data)
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        
        serializer = self.get_serializer(settings)
        return Response(serializer.data)

class CrossTenantModerationView(views.APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        resource_type = request.query_params.get('type', 'products') # 'products' or 'orders'
        search_query = request.query_params.get('search', '')
        page = int(request.query_params.get('page', 1))
        page_size = 20
        
        all_data = []
        
        # Filter out public schema
        tenants = Client.objects.exclude(schema_name='public')
        
        for tenant in tenants:
            with tenant_context(tenant):
                if resource_type == 'products':
                    queryset = Product.objects.all().prefetch_related('images')
                    if search_query:
                        queryset = queryset.filter(name__icontains=search_query)
                    data = ProductDetailSerializer(queryset, many=True).data
                else:
                    queryset = Order.objects.all()
                    if search_query:
                        queryset = queryset.filter(order_number__icontains=search_query)
                    data = OrderSerializer(queryset, many=True).data
                
                # Add tenant info to each item
                for item in data:
                    item['tenant_name'] = tenant.name
                    item['tenant_id'] = tenant.id
                
                all_data.extend(data)
        
        # Sort by creation date (if applicable)
        if resource_type == 'products':
            all_data.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        else:
            all_data.sort(key=lambda x: x.get('created_at', ''), reverse=True)

        # Manual Pagination
        total_count = len(all_data)
        start = (page - 1) * page_size
        end = start + page_size
        paginated_data = all_data[start:end]

        return Response({
            'count': total_count,
            'next': f'?type={resource_type}&page={page + 1}&search={search_query}' if end < total_count else None,
            'previous': f'?type={resource_type}&page={page - 1}&search={search_query}' if start > 0 else None,
            'results': paginated_data
        })

import csv
from django.http import HttpResponse

class SystemAnalyticsView(views.APIView):
    permission_classes = [IsStaffAdmin]

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        resource = request.query_params.get('resource', 'revenue')
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{resource}_report.csv"'
        writer = csv.writer(response)

        if resource == 'revenue':
            writer.writerow(['Month', 'Revenue'])
            # Reuse logic from GET
            data = self.get_analytics_data()
            for entry in data['revenue_over_time']:
                writer.writerow([entry['month'], entry['revenue']])
        elif resource == 'tenants':
            writer.writerow(['Tenant Name', 'Revenue'])
            data = self.get_analytics_data()
            for entry in data['top_tenants']:
                writer.writerow([entry['tenant_name'], entry['revenue']])

        return response

    def get_analytics_data(self):
        total_tenants = Client.objects.exclude(schema_name='public').count()
        total_users = User.objects.count()
        
        # Cross-tenant analytics
        total_orders = 0
        total_revenue = 0
        tenant_revenues = []
        monthly_revenue_data = {}

        tenants = Client.objects.exclude(schema_name='public')
        for tenant in tenants:
            with tenant_context(tenant):
                orders = Order.objects.all()
                total_orders += orders.count()
                delivered_orders = orders.filter(status='DELIVERED')
                revenue = delivered_orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
                total_revenue += revenue
                tenant_revenues.append({'tenant_name': tenant.name, 'revenue': float(revenue)})
                monthly = delivered_orders.annotate(month=TruncMonth('created_at')).values('month').annotate(revenue=Sum('total_amount'))
                for entry in monthly:
                    m = entry['month'].strftime('%Y-%m')
                    monthly_revenue_data[m] = monthly_revenue_data.get(m, 0) + float(entry['revenue'])

        sorted_months = sorted(monthly_revenue_data.keys())
        revenue_over_time = [{'month': m, 'revenue': monthly_revenue_data[m]} for m in sorted_months]
        top_tenants = sorted(tenant_revenues, key=lambda x: x['revenue'], reverse=True)[:5]

        return {
            'total_tenants': total_tenants,
            'total_users': total_users,
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'revenue_over_time': revenue_over_time,
            'top_tenants': top_tenants
        }

    def get(self, request):
        data = self.get_analytics_data()
        return Response(data)

    def post(self, request):
        # This handles the export_csv call when routed as a view
        return self.export_csv(request)

class DomainViewSet(viewsets.ModelViewSet):
    queryset = Domain.objects.all()
    serializer_class = DomainSerializer
    permission_classes = [IsSuperAdmin]
