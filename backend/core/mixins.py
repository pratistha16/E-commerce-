from .tenant_context import get_tenant

class TenantViewSetMixin:
    """
    Mixin to automatically filter querysets by tenant and inject tenant into created objects.
    Assumes the model has a 'vendor' field that can be linked to a tenant, 
    or the model itself is a tenant-level entity.
    """
    def get_queryset(self):
        queryset = super().get_queryset()
        tenant = get_tenant()
        if not tenant:
            return queryset
            
        # If the model has a direct link to tenant (e.g. through a field like 'tenant_id')
        if hasattr(self.get_serializer_class().Meta.model, 'tenant_id'):
            return queryset.filter(tenant_id=str(tenant.id))
            
        # If the model is linked via VendorProfile (which we can link to tenant)
        if hasattr(self.get_serializer_class().Meta.model, 'vendor'):
            # This is a bit more complex, we'd filter by vendor__user__...
            pass
            
        return queryset

    def perform_create(self, serializer):
        tenant = get_tenant()
        if tenant and hasattr(serializer.Meta.model, 'tenant_id'):
            serializer.save(tenant_id=str(tenant.id))
        else:
            serializer.save()
