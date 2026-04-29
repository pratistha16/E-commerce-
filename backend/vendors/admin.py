from django.contrib import admin
from .models import VendorProfile

@admin.register(VendorProfile)
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ('store_name', 'user', 'is_active', 'created_at')
    search_fields = ('store_name', 'user__email', 'contact_email')
    list_filter = ('is_active', 'created_at')
