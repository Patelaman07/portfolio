import json

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .error_explainer.compiler import compile_and_run
from .error_explainer.llm import explain_error_stream
from .rate_limit import limiter

router = APIRouter()

MAX_SOURCE_CHARS = 20_000


class CompileRequest(BaseModel):
    code: str


class ErrorInfo(BaseModel):
    type: str
    line: int
    column: int
    message: str


class ExplainRequest(BaseModel):
    code: str
    error: ErrorInfo
    language: str = "en"


@router.post("/api/explainer/compile")
@limiter.limit("5/minute")
def compile_endpoint(request: Request, req: CompileRequest):
    if len(req.code) > MAX_SOURCE_CHARS:
        raise HTTPException(status_code=413, detail=f"Source exceeds {MAX_SOURCE_CHARS} characters.")
    return compile_and_run(req.code)


def _stream_explanation(code: str, error: dict, language: str):
    for token in explain_error_stream(code, error, language):
        yield json.dumps({"type": "token", "text": token}) + "\n"
    yield json.dumps({"type": "done"}) + "\n"


@router.post("/api/explainer/explain")
@limiter.limit("5/minute")
def explain_endpoint(request: Request, req: ExplainRequest):
    if len(req.code) > MAX_SOURCE_CHARS:
        raise HTTPException(status_code=413, detail=f"Source exceeds {MAX_SOURCE_CHARS} characters.")
    return StreamingResponse(
        _stream_explanation(req.code, req.error.model_dump(), req.language),
        media_type="application/x-ndjson",
    )
