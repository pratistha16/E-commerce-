import threading

_thread_local = threading.local()

def set_tenant(tenant):
    _thread_local.tenant = tenant

def get_tenant():
    return getattr(_thread_local, 'tenant', None)

def clear_tenant():
    if hasattr(_thread_local, 'tenant'):
        del _thread_local.tenant
