from django.db import models
from django.conf import settings

class Client(models.Model):
    name = models.CharField(max_length=100)
    schema_name = models.CharField(max_length=63, unique=True)
    created_on = models.DateField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    def __hash__(self):
        if self.pk is None: return hash(id(self))
        return hash(self.pk)

class GlobalSettings(models.Model):
    commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    global_tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    default_shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Global Setting"
        verbose_name_plural = "Global Settings"

    def __str__(self):
        return f"Global Settings (Last updated: {self.updated_at})"

    def __hash__(self):
        if self.pk is None: return hash(id(self))
        return hash(self.pk)

class AdminActionLog(models.Model):
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    target_model = models.CharField(max_length=100)
    target_id = models.CharField(max_length=50, null=True, blank=True)
    details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.admin.username if self.admin else 'System'} - {self.action} on {self.target_model} ({self.created_at})"

    def __hash__(self):
        if self.pk is None: return hash(id(self))
        return hash(self.pk)

class Domain(models.Model):
    domain = models.CharField(max_length=253, unique=True)
    tenant = models.ForeignKey(Client, related_name='domains', on_delete=models.CASCADE)
    is_primary = models.BooleanField(default=True)

    def __str__(self):
        return self.domain

    def __hash__(self):
        if self.pk is None: return hash(id(self))
        return hash(self.pk)

class TenantSettings(models.Model):
    tenant = models.OneToOneField(Client, on_delete=models.CASCADE, related_name='settings')
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    primary_color = models.CharField(max_length=7, default='#2563eb') # Default Blue
    secondary_color = models.CharField(max_length=7, default='#0f172a') # Default Slate
    tagline = models.CharField(max_length=255, blank=True)
    footer_text = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    
    # Appearance options
    enable_dark_mode = models.BooleanField(default=True)
    layout_style = models.CharField(max_length=20, default='MODERN', choices=[
        ('MODERN', 'Modern & Clean'),
        ('BRUTALIST', 'Bold & Brutalist'),
        ('MINIMAL', 'Minimalist'),
    ])

    def __str__(self):
        return f"Settings for {self.tenant.name}"

    def __hash__(self):
        if self.pk is None: return hash(id(self))
        return hash(self.pk)
