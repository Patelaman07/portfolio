from google.genai import types

from .gemini_config import GEMINI_CHAT_MODEL, client
from .knowledge import Document

CATEGORY_KEYWORDS = {
    "agentic": ["agent", "swe", "organi", "langgraph", "multi-agent"],
    "cpp": ["c++", "dsa", "algorith", "dijkstra", "graph"],
    "stack": ["stack", "tech", "tool", "framework"],
    "resume": ["resume", "experience", "work history", "education", "job"],
    "profile": ["who are you", "about you", "location", "based", "open to"],
}

SYSTEM_PROMPT = (
    "You are the AI Portfolio Agent for a developer's personal portfolio site. "
    "Answer questions ONLY using the CONTEXT provided below — it is the developer's "
    "real profile, skills, resume and project data. Never invent facts, employers, "
    "dates or technologies that are not present in the context. Speak in first person "
    "as the developer. Keep answers to 2-4 sentences unless more detail is clearly "
    "requested. If the context doesn't actually answer the question, say plainly that "
    "you don't have that on record instead of guessing."
)


def classify_query(question: str) -> str:
    q = question.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in q for kw in keywords):
            return category
    return "general"


def build_messages(question: str, context: list[Document]) -> list[dict]:
    context_block = "\n\n".join(f"[{d.source}]\n{d.text}" for d in context)
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"CONTEXT:\n{context_block}\n\nQUESTION: {question}"},
    ]


def _to_gemini(messages: list[dict]) -> tuple[str | None, list[types.Content]]:
    system_instruction = None
    contents = []
    for m in messages:
        if m["role"] == "system":
            system_instruction = m["content"]
        else:
            role = "model" if m["role"] == "assistant" else "user"
            contents.append(types.Content(role=role, parts=[types.Part(text=m["content"])]))
    return system_instruction, contents


def chat_once(messages: list[dict]) -> str:
    system_instruction, contents = _to_gemini(messages)
    response = client.models.generate_content(
        model=GEMINI_CHAT_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(system_instruction=system_instruction),
    )
    return response.text


def chat_stream(messages: list[dict]):
    system_instruction, contents = _to_gemini(messages)
    for chunk in client.models.generate_content_stream(
        model=GEMINI_CHAT_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(system_instruction=system_instruction),
    ):
        if chunk.text:
            yield chunk.text
