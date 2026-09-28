import io
import threading
import uuid
import zipfile

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .frontend_engineer.agents.write_output_agent import _slugify
from .frontend_engineer.graph import graph
from .rate_limit import limiter

router = APIRouter()

# Ordered to match frontend_engineer/graph.py's edges — drives the pipeline status UI.
PIPELINE = [
    ("frontend_lead", "Frontend Lead"),
    ("ui_agent", "UI Architect"),
    ("component_agent", "Component Architect"),
    ("routing_agent", "Routing Architect"),
    ("state_agent", "State Architect"),
    ("api_agent", "API Architect"),
    ("styling_agent", "Styling Architect"),
    ("codegen_agent", "Codegen"),
    ("write_output", "Write Output"),
    ("finalize_project", "Finalize Report"),
]

jobs: dict[str, dict] = {}


class GenerateRequest(BaseModel):
    task: str
    project_name: str = "generated-app"


def _run_job(job_id: str, task: str, project_name: str):
    job = jobs[job_id]
    state = {
        "task": task,
        "project_name": project_name,
        "frontend_framework": "", "styling_framework": "",
        "state_library": "", "routing_library": "",
        "project_plan": "", "ui_plan": "", "component_plan": "",
        "routing_plan": "", "state_plan": "", "api_plan": "", "styling_plan": "",
        "files": {}, "output_dir": "", "logs": [], "errors": [], "final_output": "",
    }
    try:
        for update in graph.stream(state, stream_mode="updates"):
            for node_name, node_update in update.items():
                state.update(node_update)
                job["completed_nodes"].append(node_name)
                job["current_node"] = node_name
                job["logs"] = state.get("logs", [])
        job["status"] = "done"
        job["current_node"] = None
        job["files"] = state.get("files", {})
        job["output_dir"] = state.get("output_dir", "")
        job["final_output"] = state.get("final_output", "")
    except Exception as e:  # surfaces to the polling UI instead of dying silently
        job["status"] = "error"
        job["error"] = str(e)


@router.get("/api/frontend-engineer/pipeline")
def pipeline():
    return {"steps": [{"id": nid, "label": label} for nid, label in PIPELINE]}


@router.post("/api/frontend-engineer/generate")
@limiter.limit("2/minute")
def generate(request: Request, req: GenerateRequest):
    job_id = uuid.uuid4().hex[:12]
    jobs[job_id] = {
        "status": "running",
        "current_node": None,
        "completed_nodes": [],
        "logs": [],
        "files": {},
        "output_dir": "",
        "final_output": "",
        "error": None,
        "project_slug": _slugify(req.project_name),
    }
    thread = threading.Thread(target=_run_job, args=(job_id, req.task, req.project_name), daemon=True)
    thread.start()
    return {"job_id": job_id}


@router.get("/api/frontend-engineer/status/{job_id}")
def status(job_id: str):
    job = jobs.get(job_id)
    if job is None:
        return {"status": "not_found"}
    return job


@router.get("/api/frontend-engineer/download/{job_id}")
def download(job_id: str):
    """Zips the generated files (from memory, so it works where disk writes are skipped)
    inside a top-level folder named after the project."""
    job = jobs.get(job_id)
    if job is None or job["status"] != "done" or not job["files"]:
        raise HTTPException(status_code=404, detail="No finished project for this job.")

    slug = job["project_slug"]
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for rel_path, content in job["files"].items():
            safe = rel_path.replace("\\", "/").lstrip("/")
            if ".." in safe.split("/"):
                continue
            zf.writestr(f"{slug}/{safe}", content)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{slug}.zip"'},
    )
