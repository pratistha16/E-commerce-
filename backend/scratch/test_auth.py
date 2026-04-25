import os
import django
from django.conf import settings
from django.contrib.auth import authenticate

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

username = 'prath'
password = 'p@123'

print(f"Checking user: {username}")
try:
    user = User.objects.filter(username=username).first()
    if not user:
        print(f"User {username} does not exist in DB.")
    else:
        print(f"User found: {user.username}")
        print(f"Is Active: {user.is_active}")
        print(f"Role: {user.role}")
        
        auth_user = authenticate(username=username, password=password)
        if auth_user:
            print("Authentication SUCCESS!")
        else:
            print("Authentication FAILED!")
            
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
