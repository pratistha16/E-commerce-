import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGODB_URI')
print(f"Connecting to: {uri}")

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("MongoDB connection successful!")
    
    db_name = os.getenv('MONGODB_NAME', 'Ecommerce')
    db = client[db_name]
    print(f"Using database: {db_name}")
    
    # List collections
    collections = db.list_collection_names()
    print(f"Collections: {collections}")
    
    # Check users collection
    if 'users_user' in collections:
        user = db.users_user.find_one({'username': 'prath'})
        if user:
            print(f"User 'prath' found: {user['username']}")
            print(f"Is Active: {user.get('is_active')}")
        else:
            print("User 'prath' NOT found in users_user collection")
    else:
        print("Collection 'users_user' not found")

except Exception as e:
    print(f"MongoDB connection failed: {e}")
