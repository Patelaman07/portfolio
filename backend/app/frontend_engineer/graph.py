from langgraph.graph import StateGraph, START, END

from .state import FrontendState

from .agents.frontend_lead import (
    frontend_lead,
    finalize_project,
)

from .agents.ui_agent import ui_agent
from .agents.component_agent import component_agent
from .agents.routing_agent import routing_agent
from .agents.state_agent import state_agent
from .agents.api_agent import api_agent
from .agents.styling_agent import styling_agent
from .agents.codegen_agent import codegen_agent
from .agents.write_output_agent import write_output


builder = StateGraph(FrontendState)

# ------------------------
# Nodes
# ------------------------

builder.add_node("frontend_lead", frontend_lead)

builder.add_node("ui_agent", ui_agent)

builder.add_node("component_agent", component_agent)

builder.add_node("routing_agent", routing_agent)

builder.add_node("state_agent", state_agent)

builder.add_node("api_agent", api_agent)

builder.add_node("styling_agent", styling_agent)

builder.add_node("codegen_agent", codegen_agent)

builder.add_node("write_output", write_output)

builder.add_node("finalize_project", finalize_project)

# ------------------------
# Edges
# ------------------------

builder.add_edge(START, "frontend_lead")

builder.add_edge("frontend_lead", "ui_agent")

builder.add_edge("ui_agent", "component_agent")

builder.add_edge("component_agent", "routing_agent")

builder.add_edge("routing_agent", "state_agent")

builder.add_edge("state_agent", "api_agent")

builder.add_edge("api_agent", "styling_agent")

builder.add_edge("styling_agent", "codegen_agent")

builder.add_edge("codegen_agent", "write_output")

builder.add_edge("write_output", "finalize_project")

builder.add_edge("finalize_project", END)

graph = builder.compile()
