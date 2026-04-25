from django.contrib import admin
from .models import Client, Domain, GlobalSettings, AdminActionLog

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'schema_name', 'created_on', 'is_approved', 'is_active')
    list_filter = ('is_approved', 'is_active')
    search_fields = ('name', 'schema_name')

@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ('domain', 'tenant', 'is_primary')
    list_filter = ('is_primary',)
    search_fields = ('domain',)

@admin.register(GlobalSettings)
class GlobalSettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'commission_percentage', 'global_tax_percentage', 'default_shipping_fee', 'updated_at')

@admin.register(AdminActionLog)
class AdminActionLogAdmin(admin.ModelAdmin):
    list_display = ('admin', 'action', 'target_model', 'created_at')
    list_filter = ('action', 'target_model')
