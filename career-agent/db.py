from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
print("✅ Loaded URI:", mongo_uri)  # Debug line

client = MongoClient(mongo_uri)
db = client["linkedinDB"]
users_collection = db["users"]

def get_user_profile(user_id):
    #print("🔍 Searching for user:", user_id)  
    # Debug line
    result = users_collection.find_one({"userId": user_id})
    #print("📦 Result:", result)  
    # Debug line
    return result
