from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

uri = os.getenv("MONGODB_URI")
try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.server_info()
    print("MongoDB Connection Successful")
except Exception as e:
    print(f"MongoDB Connection Failed: {e}")
