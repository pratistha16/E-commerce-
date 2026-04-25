from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Super Admin'),
        ('STAFF', 'Staff Admin'),
        ('VENDOR', 'Vendor'),
        ('CUSTOMER', 'Customer'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='CUSTOMER')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='users/profiles/', null=True, blank=True)
    
    @property
    def is_vendor(self):
        return self.role == 'VENDOR'

    @property
    def is_admin_role(self):
        return self.role == 'ADMIN'

    def __str__(self):
        return f"{self.username} ({self.role})"

class Notification(models.Model):
    TYPES = (
        ('ORDER_UPDATE', 'Order Update'),
        ('PROMOTION', 'Promotion'),
        ('SYSTEM', 'System Alert'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPES, default='SYSTEM')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"
