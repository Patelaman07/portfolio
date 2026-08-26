import json
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .error_explainer_routes import router as error_explainer_router
from .frontend_engineer_routes import router as frontend_engineer_router
from .graph import FALLBACK
from .llm import build_messages, chat_stream, classify_query
from .rate_limit import limiter
from .retrieval import get_index

DEFAULT_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")

app = FastAPI(title="Portfolio Agent API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(frontend_engineer_router)
app.include_router(error_explainer_router)


class AskRequest(BaseModel):
    question: str


@app.on_event("startup")
def warm_index():
    get_index()  # embeds the knowledge base once at startup, not per-request


@app.get("/api/health")
def health():
    return {"status": "ok"}


def _stream_answer(question: str):
    category = classify_query(question)
    matches = get_index().search(question)

    if not matches:
        yield json.dumps({"type": "meta", "category": category, "grounded": False}) + "\n"
        yield json.dumps({"type": "token", "text": FALLBACK}) + "\n"
        yield json.dumps({"type": "done", "sources": [], "grounded": False}) + "\n"
        return

    docs = [doc for doc, _score in matches]
    yield json.dumps({"type": "meta", "category": category, "grounded": True}) + "\n"

    messages = build_messages(question, docs)
    for token in chat_stream(messages):
        yield json.dumps({"type": "token", "text": token}) + "\n"

    seen, sources = set(), []
    for doc in docs:
        if doc.source not in seen:
            seen.add(doc.source)
            sources.append(doc.source)
    yield json.dumps({"type": "done", "sources": sources, "grounded": True}) + "\n"


@app.post("/api/agent/ask")
@limiter.limit("10/minute")
def ask(request: Request, req: AskRequest):
    return StreamingResponse(_stream_answer(req.question), media_type="application/x-ndjson")
