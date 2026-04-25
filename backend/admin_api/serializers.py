from rest_framework import serializers
from users.models import User
from tenants.models import Client, GlobalSettings, AdminActionLog
from products.models import Product
from orders.models import Order, OrderItem
from vendors.models import VendorProfile

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class AdminClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'schema_name', 'name', 'created_on', 'is_approved', 'is_active']
        read_only_fields = ['id', 'created_on']

class AdminProductSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.store_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'vendor_name', 'category_name', 'price', 'stock', 'is_available', 'created_at']

class AdminOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'quantity', 'price']

class AdminOrderSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    vendor_name = serializers.CharField(source='vendor.store_name', read_only=True)
    items = AdminOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user_email', 'vendor_name', 'total_amount', 'status', 'payment_status', 'created_at', 'items']

class AdminGlobalSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalSettings
        fields = ['id', 'commission_percentage', 'global_tax_percentage', 'default_shipping_fee', 'updated_at']
        read_only_fields = ['id', 'updated_at']

class AdminActionLogSerializer(serializers.ModelSerializer):
    admin_username = serializers.CharField(source='admin.username', read_only=True)
    class Meta:
        model = AdminActionLog
        fields = ['id', 'admin_username', 'action', 'target_model', 'target_id', 'details', 'ip_address', 'created_at']
