# Sentient Workspace (Parcle + Enter Pro)

Welcome to the **Sentient Workspace**, built for the Quackathon (Track 01). This project bridges the gap between software intelligence and physical perception by giving AI coding agents an "Eternal Architect" memory system.

By combining **Enter CLI**, **Parcle Memory API**, and the **Model Context Protocol (MCP)**, this system ensures that autonomous code generation adheres strictly to scraped visual design specifications and explicitly defined architectural constraints.

---

## 🏗️ Architecture & Folder Structure

The application is broken down into three tightly integrated microservices:

### 1. `user-frontend/` (The Interface)
A Next.js 14 application styled with TailwindCSS that serves as the mock "Enter Web" client interface.
- **Role:** Captures natural language prompts from the user (e.g., *"Build a simple dashboard page. Use the style of https://stripe.com/in. Use Firebase for database."*) and provides a live, polling-free status update of the orchestrator's progress.
- **Connection:** Sends a `POST` request to the backend's `/orchestrate` endpoint and waits for the final live preview URL.

### 2. `parcle-backend/` (The Brain & Eternal Architect)
A Python FastAPI server that acts as the central Orchestrator and Pre-flight Governor.
- **Role:** Houses the core workflow logic. It dynamically parses URLs, manages Parcle Memory namespaces (Project IDs), and strictly governs the AI's output.
- **Connection:** 
  - Subprocesses the `website-cloner` MCP client.
  - Exposes an `/ingest-design` webhook used by the cloner to save memories.
  - Interfaces directly with the Parcle Python SDK to retrieve architectural context.
  - Subprocesses the global `@enter-pro/enter-cli` to trigger cloud builds.

### 3. `website-cloner/` (The Perception Engine)
A Node.js/TypeScript implementation of an **MCP (Model Context Protocol) Server**.
- **Role:** When invoked, it takes a target URL, uses the **Firecrawl REST API** to deeply scrape the DOM, and passes the scraped data to **Google Gemini**. Gemini analyzes the structure, colors, and typography, outputting a rigid Markdown design specification (`design.md`).
- **Connection:** The Python backend executes `invoke_mcp_cloner.ts`, which connects to the local MCP server over `stdio`. The server then pushes the compiled design back to the Python backend via the `/ingest-design` HTTP endpoint.

---

## 🔄 The Execution Pipeline (Real-Time Workflow)

When a user submits a prompt, the system executes the following phases in real-time:

### Phase 1: Dynamic Design & Memory Ingestion
1. The Orchestrator receives the prompt and uses regex to extract any target URLs.
2. It generates a unique `Project ID` (UUID).
3. **User Constraint Ingestion:** The Orchestrator explicitly ingests the user's raw prompt into Parcle Memory under the `Project ID`. This guarantees that explicit architectural choices (like "Use Firebase") are permanently logged.
4. **Visual Scraping:** The Orchestrator spawns the `website-cloner` MCP Client via standard I/O. 
5. The Cloner scrapes the URL, extracts a highly detailed `design.md`, and pushes it to `/ingest-design`. Parcle now has both the visual constraints and the database constraints.

### Phase 2: Eternal Architect Governance
1. The Orchestrator pauses and queries the Parcle Memory API for the active `Project ID`.
2. It asks Parcle: *"What are the strict architectural constraints, database choices, component designs, and styling guidelines for this project?"*
3. Parcle retrieves the exact HEX codes, component structures, and backend requirements (e.g., Firebase).
4. The Eternal Architect compiles a **Master Prompt**, taking the user's immediate request and wrapping it in non-negotiable constraints retrieved from memory.

### Phase 3: Autonomous Generation
1. The backend triggers the Enter CLI (`enter-cli proj create --wait`) using the Master Prompt.
2. The Enter Cloud spins up AI agents that write, build, and deploy the Next.js application based on the merged constraints.
3. Because we pass the `--wait` flag, the backend holds the connection until the cloud deployment finishes.
4. The final, working `preview_url` is returned to the frontend for the user to click.

---

## 🚀 How to Run the Demonstration

To run the full stack locally for a presentation, use two separate terminal windows.

**Terminal 1 (Backend & Orchestrator):**
```powershell
cd parcle-backend
python -m uvicorn main:app --port 8000
```
*(Leave this terminal visible! It will stream highly descriptive, color-coded ANSI logs of the entire pipeline in real-time for the judges.)*

**Terminal 2 (Frontend UI):**
```powershell
cd user-frontend
npm run dev
```

Navigate to `http://localhost:3000`, type a prompt with a URL, and watch the Sentient Workspace come to life!
