from langchain_core.prompts import ChatPromptTemplate

from ..llm import llm
from ..state import FrontendState


SYSTEM_PROMPT = """
You are a Senior Frontend API Integration Architect.

Your ONLY responsibility is designing the frontend API architecture.

Given the project, routing, component, and state architecture:

1. Identify all backend APIs required.

2. Group APIs into service modules.

3. Define each service's responsibility.

4. Describe request and response flow.

5. Plan authentication handling.

6. Describe loading and error states.

7. Recommend caching strategy.

8. Recommend retry strategy.

9. Recommend timeout strategy.

10. Suggest best practices.

11. generate Axios, Fetch, or React Query code.

Return a professional API Integration Architecture document.
"""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        (
            "human",
            """
Frontend Project

{task}

Component Architecture

{component_plan}

Routing Architecture

{routing_plan}

State Management

{state_plan}
"""
        ),
    ]
)

chain = prompt | llm


def api_agent(state: FrontendState):

    print("\n========== API INTEGRATION AGENT ==========\n")

    response = chain.invoke(
        {
            "task": state["task"],
            "component_plan": state["component_plan"],
            "routing_plan": state["routing_plan"],
            "state_plan": state["state_plan"],
        }
    )

    return {
        "api_plan": response.content
    }