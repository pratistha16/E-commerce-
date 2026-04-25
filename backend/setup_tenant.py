import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from tenants.models import Client, Domain

def setup_public_tenant():
    # Create public tenant if it doesn't exist
    if not Client.objects.filter(schema_name='public').exists():
        tenant = Client(
            schema_name='public',
            name='Public Tenant',
        )
        tenant.save()
        
        # Add domain
        domain = Domain()
        domain.domain = 'localhost' # or your domain
        domain.tenant = tenant
        domain.is_primary = True
        domain.save()
        print("Public tenant and domain created for localhost")
    else:
        print("Public tenant already exists")

if __name__ == "__main__":
    setup_public_tenant()
