import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from parcle import Parcle
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Website Cloner Parcle Backend")

# Initialize Parcle Client
parcle_api_key = os.getenv("PARCLE_API_KEY")
if not parcle_api_key:
    print("Warning: PARCLE_API_KEY is missing from environment variables.")

parcle_client = Parcle(api_key=parcle_api_key) if parcle_api_key else None

class DesignPayload(BaseModel):
    user_id: str
    design_markdown: str
    session_id: str | None = None

@app.post("/ingest-design")
async def ingest_design(payload: DesignPayload):
    if not parcle_client:
        raise HTTPException(status_code=500, detail="Parcle API key is not configured.")
        
    try:
        # Create user namespace first
        parcle_client.create_user(user_id=payload.user_id, name="Design Agent User")
        
        # Ingest the design document as a conversation/dialog
        # Providing it as an assistant message that establishes the context
        dialog = parcle_client.ingest_dialog(
            user_id=payload.user_id,
            session_id=payload.session_id,
            messages=[
                {
                    "role": "user",
                    "content": "Here is the new design specification for our project."
                },
                {
                    "role": "assistant",
                    "content": payload.design_markdown
                }
            ],
            tag={"app": "website-cloner", "source": "design-spec"}
        )
        
        return {
            "status": "success", 
            "session_id": dialog.session_id,
            "event_id": getattr(dialog, "event_id", None),
            "message": "Design spec successfully ingested into Parcle Memory API."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
