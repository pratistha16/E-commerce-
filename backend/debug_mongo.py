import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings
print(f"DEBUG: MONGODB_URI in settings is: {settings.MONGODB_URI}")

from users.models import User

try:
    print("Attempting to count users...")
    count = User.objects.count()
    print(f"User count: {count}")
    
    print("Attempting to fetch first user...")
    user = User.objects.first()
    if user:
        print(f"User found: {user.username}")
        print(f"Password check: {user.check_password('p@123')}")
    else:
        print("No user found")
        
except Exception as e:
    print("Caught an exception:")
    traceback.print_exc()
    if hasattr(e, '__cause__') and e.__cause__:
        print("\nCaused by:")
        traceback.print_exception(type(e.__cause__), e.__cause__, e.__cause__.__traceback__)
