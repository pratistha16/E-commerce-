import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

output_file = 'user_check_results.txt'

with open(output_file, 'w') as f:
    f.write(f"Checking users...\n")
    try:
        users = User.objects.all()
        f.write(f"Total users: {users.count()}\n")
        for user in users:
            f.write(f"Username: {user.username}, Role: {user.role}, Is Active: {user.is_active}\n")
    except Exception:
        import traceback
        f.write(f"Error:\n{traceback.format_exc()}\n")

print(f"Results written to {output_file}")
