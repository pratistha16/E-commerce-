from django.db import models
from tenants.models import Client
from .tenant_context import get_tenant

class TenantManager(models.Manager):
    def get_queryset(self):
        tenant = get_tenant()
        queryset = super().get_queryset()
        if tenant:
            return queryset.filter(tenant_id=str(tenant.id))
        return queryset

class TenantAwareModel(models.Model):
    tenant_id = models.CharField(max_length=24, db_index=True, null=True, blank=True)
    
    objects = TenantManager()
    unfiltered_objects = models.Manager()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.tenant_id:
            tenant = get_tenant()
            if tenant:
                self.tenant_id = str(tenant.id)
        super().save(*args, **kwargs)

    def __hash__(self):
        if self.pk is None: return hash(id(self))
        return hash(self.pk)
