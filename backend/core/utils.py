from tenants.models import AdminActionLog
from users.models import User, Notification

def log_admin_action(request, action, target_model, target_id=None, details=None):
    AdminActionLog.objects.create(
        admin=request.user,
        action=action,
        target_model=target_model,
        target_id=str(target_id) if target_id else None,
        details=details or {},
        ip_address=request.META.get('REMOTE_ADDR')
    )

def notify_admins(title, message, notification_type='SYSTEM'):
    """
    Sends a notification to all Super Admins and Staff Admins.
    """
    admins = User.objects.filter(role__in=['ADMIN', 'STAFF'])
    notifications = [
        Notification(
            user=admin,
            title=title,
            message=message,
            notification_type=notification_type
        ) for admin in admins
    ]
    Notification.objects.bulk_create(notifications)
