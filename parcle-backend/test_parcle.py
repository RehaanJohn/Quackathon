import os
from parcle import Parcle
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("PARCLE_API_KEY")
print(f"Loaded API Key: {api_key[:10]}...")

try:
    client = Parcle(api_key=api_key)
    print("Testing connection to Parcle...")
    
    # 1. Create a user
    user = client.create_user(user_id="test_user", name="Test User")
    print(f"User created: {user.user_id}")
    
    # 2. Ingest some basic dialog
    dialog = client.ingest_dialog(
        user_id="test_user",
        messages=[
            {"role": "user", "content": "I like the primary color to be #635BFF"},
            {"role": "assistant", "content": "Got it, your primary color is Stripe purple."}
        ],
        tag={"app": "test"}
    )
    print(f"Dialog ingested. Session ID: {dialog.session_id}")
    
    # 3. Wait for it to be ready
    print("Waiting for ingestion to be ready...")
    # The SDK automatically waits by default on ingestion unless wait=False is passed.
    
    # 4. Search memory
    print("Searching memory...")
    result = client.search(
        user_id="test_user",
        query="What is my primary color?"
    )
    print("\n--- Search Result ---")
    print(f"Answer: {result.answer}")
    print(f"Confidence: {result.confidence}")
    print(f"Citations: {result.citations}")
    print("---------------------\n")
    print("Parcle integration is fully working!")

except Exception as e:
    print(f"Error testing Parcle: {e}")
