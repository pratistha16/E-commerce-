import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

def check_user(username):
    try:
        user = User.objects.get(username=username)
        print(f"User: {user.username}")
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print(f"Is Active: {user.is_active}")
        print(f"Is Staff: {user.is_staff}")
        print(f"Is Superuser: {user.is_superuser}")
        print(f"Has Usable Password: {user.has_usable_password()}")
    except User.DoesNotExist:
        print(f"User {username} does not exist.")

if __name__ == "__main__":
    check_user('prath')
