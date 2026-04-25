import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

def reset_admin_password(username, password):
    try:
        user, created = User.objects.get_or_create(username=username)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.role = 'ADMIN'
        user.is_active = True
        user.save()
        if created:
            print(f"Created new user {username} and set password.")
        else:
            print(f"Reset password for existing user {username}.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_admin_password('prath', 'p@123')
