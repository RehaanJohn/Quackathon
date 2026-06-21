import os
import json
import subprocess
import re
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from parcle import Parcle
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Website Cloner Parcle Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
                    "content": f"Here is the strict architectural design specification and component inventory for our project that MUST be followed:\n\n{payload.design_markdown}"
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

class OrchestratePayload(BaseModel):
    user_id: str
    prompt: str

@app.post("/orchestrate")
def orchestrate(payload: OrchestratePayload):
    if not parcle_client:
        raise HTTPException(status_code=500, detail="Parcle API key is not configured.")
        
    try:
        # 0. Check for URL in prompt
        url_match = re.search(r'(https?://[^\s]+)', payload.prompt)
        target_url = None
        if url_match:
            target_url = url_match.group(0).rstrip('.,;:!?"\')')
        
        # Use provided user_id or generate a new unique project ID if a URL is found
        project_id = str(uuid.uuid4()) if target_url else payload.user_id
        
        # If a URL is found, invoke the website-cloner to ingest the design spec
        if target_url:
            print(f"[Orchestrator] URL found: {target_url}. Invoking cloner for project {project_id}...")
            cloner_cmd = [
                "npx.cmd", "ts-node", "invoke_mcp_cloner.ts", target_url, project_id
            ]
            subprocess.run(cloner_cmd, cwd="C:\\Users\\Gaming\\Pictures\\Coding_Projects\\Quackathon\\website-cloner", check=True)
            print(f"[Orchestrator] Finished ingesting design for {target_url} into Parcle.")

        # 1. ETERNAL ARCHITECT: Retrieve architectural context from Parcle
        print(f"[Eternal Architect] Querying Parcle for user/project {project_id}...")
        search_result = parcle_client.search(
            user_id=project_id,
            query="What are the strict architectural constraints, database choices, component designs, and styling guidelines for this project?"
        )
        parcle_context = search_result.answer

        # 2. ETERNAL ARCHITECT: Conflict Detection & Prompt Compilation
        # Here, the architect forces the user's prompt to comply with Parcle's memory.
        master_prompt = (
            f"You are the execution engine. Build a web application based on the user's request. "
            f"CRITICAL ARCHITECTURAL CONSTRAINTS (from Eternal Architect memory): {parcle_context}\n\n"
            f"USER REQUEST: {payload.prompt}\n\n"
            f"If the user request conflicts with the constraints (e.g. wrong database or color scheme), "
            f"you MUST override the user request to follow the architectural constraints."
        )
        print(f"[Eternal Architect] Master prompt compiled. Executing Enter CLI...")

        # 3. EXECUTE ENTER CLI
        workspace_id = "10000087158" # Hardcoded for the hackathon
        command = [
            "enter-cli.cmd", "proj", "create", workspace_id,
            "--name", "sentient-auto-build",
            "--prompt", master_prompt,
            "-o", "json"
        ]
        
        # Run the CLI
        process = subprocess.run(command, capture_output=True, text=True, cwd="C:\\Windows\\System32")
        
        if process.returncode != 0:
            print("Enter CLI Error:", process.stderr)
            raise Exception(f"Enter CLI failed: {process.stderr}")
            
        try:
            cli_output = json.loads(process.stdout)
            preview_url = cli_output.get("project", {}).get("preview_url", "")
            project_id = cli_output.get("project", {}).get("project_id", "")
        except json.JSONDecodeError:
            raise Exception("Failed to parse Enter CLI JSON output")

        return {
            "status": "success",
            "message": "The Eternal Architect has successfully deployed your application.",
            "project_id": project_id,
            "preview_url": preview_url,
            "architect_context_used": parcle_context
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
