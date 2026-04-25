from django.conf import settings
from django.core.cache import cache
from .tenant_context import set_tenant, clear_tenant
from tenants.models import Domain

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        hostname = request.get_host().split(':')[0]
        
        # Try to get tenant from cache
        cache_key = f"tenant_{hostname}"
        tenant_id = cache.get(cache_key)
        
        if tenant_id:
            from tenants.models import Client
            tenant = Client.objects.filter(id=tenant_id).first()
        else:
            try:
                domain = Domain.objects.select_related('tenant').get(domain=hostname)
                tenant = domain.tenant
                # Cache the ID
                cache.set(cache_key, str(tenant.id), 3600) # Cache for 1 hour
            except Domain.DoesNotExist:
                tenant = None
        
        set_tenant(tenant)
        request.tenant = tenant
            
        response = self.get_response(request)
        clear_tenant()
        return response
