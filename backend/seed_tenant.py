import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from tenants.models import Client, Domain
from vendors.models import VendorProfile
from products.models import Category, Product
from users.models import User

def seed_tenant():
    # 0. Create Public Tenant record
    public_tenant, created = Client.objects.get_or_create(
        schema_name='public', 
        name='Public Schema'
    )
    if created:
        Domain.objects.get_or_create(
            domain='localhost', 
            tenant=public_tenant, 
            is_primary=True
        )
        print("Public tenant record created.")

    # 0.5 Create Superuser
    if not User.objects.filter(username='prath').exists():
        User.objects.create_superuser('prath', 'admin@example.com', 'p@123', role='ADMIN')
        print("Superuser created.")

    # 1. Create Tenant record
    tenant, created = Client.objects.get_or_create(
        schema_name='electronics', 
        name='Electronics Hub'
    )
    if created:
        Domain.objects.get_or_create(
            domain='electronics.localhost', 
            tenant=tenant, 
            is_primary=True
        )
        print(f"Tenant record 'electronics' created.")
    
    # 3. Seed Data (Shared database for now)
    vendor_user, created = User.objects.get_or_create(
        username='vendor1', 
        defaults={'email':'vendor1@example.com', 'role':'VENDOR'}
    )
    if created:
        vendor_user.set_password('vendor123')
        vendor_user.save()

    vendor_profile, _ = VendorProfile.objects.get_or_create(
        user=vendor_user, 
        defaults={'store_name': 'Electronics Hub', 'description': 'The best electronics store.'}
    )

    electronics, _ = Category.objects.get_or_create(name='Electronics', slug='electronics')
    laptops, _ = Category.objects.get_or_create(name='Laptops', slug='laptops', parent=electronics)

    product, _ = Product.objects.get_or_create(
        vendor=vendor_profile, 
        category=laptops, 
        name='MacBook Pro 16', 
        slug='macbook-pro-16', 
        defaults={'description': 'Powerful laptop.', 'price': 2499.99, 'stock': 10}
    )
    print(f"Seed data created. Product: {product.name}")

if __name__ == "__main__":
    seed_tenant()
