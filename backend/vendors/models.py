from django.db import models
from django.conf import settings

class VendorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    store_name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='vendors/logos/', null=True, blank=True)
    favicon = models.ImageField(upload_to='vendors/favicons/', null=True, blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    
    # Theme & Colors
    primary_color = models.CharField(max_length=7, default='#000000') # Hex code
    secondary_color = models.CharField(max_length=7, default='#ffffff')
    background_color = models.CharField(max_length=7, default='#f8f9fa')
    button_style = models.CharField(max_length=50, choices=[('rounded', 'Rounded'), ('square', 'Square'), ('pill', 'Pill')], default='rounded')
    
    # Layout Options
    homepage_layout = models.CharField(max_length=50, choices=[('grid', 'Grid'), ('list', 'List'), ('banner', 'Banner Style')], default='grid')
    featured_products_enabled = models.BooleanField(default=True)
    hero_banner = models.ImageField(upload_to='vendors/banners/', null=True, blank=True)
    
    # Typography
    font_family = models.CharField(max_length=100, default='Inter, sans-serif')
    font_size_scale = models.FloatField(default=1.0) # Scale factor for fonts
    
    # Contact Info
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    social_links = models.JSONField(default=dict, blank=True) # {"facebook": "...", "instagram": "..."}
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.store_name
