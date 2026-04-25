import os
import django
from django.core.files.base import ContentFile
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Category, Product
from users.models import User
from django_tenants.utils import schema_context

from vendors.models import VendorProfile
from django.utils.text import slugify

def seed_data():
    with schema_context('main'):
        # Create categories
        electronics, _ = Category.objects.get_or_create(name='Electronics', slug='electronics')
        fashion, _ = Category.objects.get_or_create(name='Fashion', slug='fashion')
        home, _ = Category.objects.get_or_create(name='Home', slug='home')
        
        # Get or create a vendor
        user, _ = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@example.com', 'role': 'VENDOR'}
        )
        if _:
            user.set_password('admin123')
            user.save()

        vendor, _ = VendorProfile.objects.get_or_create(
            user=user,
            defaults={'store_name': 'Main Store', 'description': 'The main marketplace store.'}
        )

        products_data = [
            {
                'name': 'Zenith Wireless Headphones',
                'description': 'High-quality wireless headphones with noise cancellation.',
                'price': 299.00,
                'category': electronics,
                'stock': 50,
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80'
            },
            {
                'name': 'Sport Analog Driver',
                'description': 'A classic analog watch for daily wear.',
                'price': 185.00,
                'category': fashion,
                'stock': 30,
                'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80'
            },
            {
                'name': 'Velocity Sport Runner',
                'description': 'Lightweight running shoes for athletes.',
                'price': 120.00,
                'category': fashion,
                'stock': 100,
                'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80'
            },
            {
                'name': 'Orbital Desk Light',
                'description': 'Modern desk light with adjustable brightness.',
                'price': 89.00,
                'category': home,
                'stock': 45,
                'image_url': 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=500&q=80'
            }
        ]
        
        for data in products_data:
            Product.objects.get_or_create(
                name=data['name'],
                defaults={
                    'description': data['description'],
                    'price': data['price'],
                    'category': data['category'],
                    'stock': data['stock'],
                    'vendor': vendor,
                    'slug': slugify(data['name']),
                    'is_available': True
                }
            )
        print("Successfully seeded products into main schema")

if __name__ == '__main__':
    seed_data()
