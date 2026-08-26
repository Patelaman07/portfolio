from langchain_core.prompts import ChatPromptTemplate

from ..llm import llm
from ..state import FrontendState




LEAD_SYSTEM_PROMPT = """
You are a Principal Frontend Engineering Manager.

Your responsibility is to manage a frontend engineering team.

Available specialists:

1. UI Architect
2. Component Architect
3. Routing Architect
4. State Management Architect
5. API Integration Architect
6. Styling Architect

Your job is to:

1. Understand the project.
2. Define project goals.
3. Recommend the technology stack.
4. Recommend the frontend framework.
5. Recommend the routing library.
6. Recommend the state management library.
7. Recommend the styling framework.
8. Define project constraints.
9. Create a development roadmap.

Do NOT generate React code.

Return a professional project planning document.
"""

lead_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", LEAD_SYSTEM_PROMPT),
        ("human", "{task}")
    ]
)

lead_chain = lead_prompt | llm


def frontend_lead(state: FrontendState):

    print("\n========== FRONTEND LEAD ==========\n")

    response = lead_chain.invoke(
        {
            "task": state["task"]
        }
    )

    return {
        "project_plan": response.content
    }




SUMMARY_SYSTEM_PROMPT = """
You are the Frontend Engineering Manager.

Your team has completed the frontend planning.

Create ONE professional report.

The report should contain:

1. Project Overview

2. Recommended Technology Stack

3. UI Architecture Summary

4. Component Architecture Summary

5. Routing Summary

6. State Management Summary

7. API Integration Summary

8. Styling Summary

9. Recommended Folder Structure

10. Development Roadmap

11. Best Practices

12. generate React code.

Return a clean professional architecture report.
"""

summary_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SUMMARY_SYSTEM_PROMPT),
        (
            "human",
            """
Project Plan

{project_plan}

--------------------------------

UI Architecture

{ui_plan}

--------------------------------

Component Architecture

{component_plan}

--------------------------------

Routing Architecture

{routing_plan}

--------------------------------

State Management

{state_plan}

--------------------------------

API Integration

{api_plan}

--------------------------------

Styling

{styling_plan}
"""
        )
    ]
)

summary_chain = summary_prompt | llm


def finalize_project(state: FrontendState):

    print("\n========== FINAL FRONTEND REPORT ==========\n")

    response = summary_chain.invoke(
        {
            "project_plan": state["project_plan"],
            "ui_plan": state["ui_plan"],
            "component_plan": state["component_plan"],
            "routing_plan": state["routing_plan"],
            "state_plan": state["state_plan"],
            "api_plan": state["api_plan"],
            "styling_plan": state["styling_plan"],
        }
    )

    return {
        "final_output": response.content
    }