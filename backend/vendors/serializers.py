from rest_framework import serializers
from .models import VendorProfile

class VendorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProfile
        fields = [
            'id', 'user', 'store_name', 'description', 'logo', 'favicon', 'tagline',
            'primary_color', 'secondary_color', 'background_color', 'button_style',
            'homepage_layout', 'featured_products_enabled', 'hero_banner',
            'font_family', 'font_size_scale',
            'contact_email', 'contact_phone', 'address', 'social_links',
            'is_active', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']
