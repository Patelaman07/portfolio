from langchain_core.prompts import ChatPromptTemplate

from ..llm import llm
from ..state import FrontendState


SYSTEM_PROMPT = """
You are a Senior Frontend State Management Architect.

Your ONLY responsibility is state architecture.

Given the frontend project, routing architecture, and component architecture:

1. Identify global state.

2. Identify local component state.

3. Define application stores.

4. Group state into logical slices.

5. Describe the responsibility of each slice.

6. Define data flow between pages.

7. Describe authentication state.

8. Describe cache strategy.

9. Describe persistence strategy.

10. Recommend best practices.

11. generate Redux, Zustand, Context API, or React code.

Return a professional State Management Architecture document.
"""


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        (
            "human",
            """
Project

{task}

Component Architecture

{component_plan}

Routing Architecture

{routing_plan}
"""
        )
    ]
)

chain = prompt | llm


def state_agent(state: FrontendState):

    print("\n========== STATE MANAGEMENT AGENT ==========\n")

    response = chain.invoke(
        {
            "task": state["task"],
            "component_plan": state["component_plan"],
            "routing_plan": state["routing_plan"],
        }
    )

    return {
        "state_plan": response.content
    }