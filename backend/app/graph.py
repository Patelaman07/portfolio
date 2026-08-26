from typing import TypedDict

from langgraph.graph import END, StateGraph

from .llm import build_messages, chat_once, classify_query
from .retrieval import get_index

FALLBACK = "I don't have that on record. Try asking about the agentic SWE system, the C++ DSA lab, the tech stack, or my resume."


class AgentState(TypedDict):
    question: str
    category: str
    context: list[dict]
    answer: str
    sources: list[str]
    grounded: bool


def classify_node(state: AgentState) -> AgentState:
    return {**state, "category": classify_query(state["question"])}


def retrieve_node(state: AgentState) -> AgentState:
    matches = get_index().search(state["question"])
    context = [{"source": doc.source, "text": doc.text, "score": score} for doc, score in matches]
    return {**state, "context": context}


def generate_node(state: AgentState) -> AgentState:
    if not state["context"]:
        return {**state, "answer": FALLBACK, "grounded": False}

    class _Doc:
        def __init__(self, d):
            self.source, self.text = d["source"], d["text"]

    messages = build_messages(state["question"], [_Doc(c) for c in state["context"]])
    answer = chat_once(messages)
    return {**state, "answer": answer, "grounded": True}


def validate_node(state: AgentState) -> AgentState:
    if not state["grounded"]:
        return {**state, "sources": []}
    seen, sources = set(), []
    for c in state["context"]:
        if c["source"] not in seen:
            seen.add(c["source"])
            sources.append(c["source"])
    return {**state, "sources": sources}


def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("classify", classify_node)
    graph.add_node("retrieve", retrieve_node)
    graph.add_node("generate", generate_node)
    graph.add_node("validate", validate_node)

    graph.set_entry_point("classify")
    graph.add_edge("classify", "retrieve")
    graph.add_edge("retrieve", "generate")
    graph.add_edge("generate", "validate")
    graph.add_edge("validate", END)

    return graph.compile()


_compiled = None


def run_agent(question: str) -> AgentState:
    """Reference (non-streaming) path through the classify -> retrieve -> generate ->
    validate workflow. The live HTTP endpoint reuses the same classify/retrieve/prompt
    helpers directly so it can stream LLM tokens — a raw generate_content_stream call
    can't be streamed through graph.invoke(), which only returns final node state."""
    global _compiled
    if _compiled is None:
        _compiled = build_graph()
    return _compiled.invoke({
        "question": question, "category": "", "context": [],
        "answer": "", "sources": [], "grounded": False,
    })
