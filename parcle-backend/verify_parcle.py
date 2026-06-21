import os
from parcle import Parcle
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("PARCLE_API_KEY")
client = Parcle(api_key=api_key)

print("Querying Parcle memory for the 'default_mcp_user'...\n")

query = "What is the primary color hex code and what is the accent color for the Stripe design? Also, what font is used for the Display text?"

try:
    result = client.search(
        user_id="default_mcp_user",
        query=query
    )
    
    print(f"Question: {query}")
    print(f"\nParcle's Answer: {result.answer}")
    print(f"Confidence Score: {result.confidence}")
    
    if result.confidence > 0.8:
        print("\n✅ Verification Successful: Parcle has correctly memorized the Stripe design spec!")
    else:
        print("\n❌ Verification Failed: Parcle did not return a high confidence answer.")
        
except Exception as e:
    print(f"Error querying Parcle: {e}")
