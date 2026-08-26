from langchain_core.prompts import ChatPromptTemplate

from ..llm import llm
from ..state import FrontendState


SYSTEM_PROMPT = """
You are a Senior React Routing Architect.

Your ONLY responsibility is routing architecture.

Given the frontend project and component architecture:

1. Identify all routes.

2. Separate public and protected routes.

3. Design nested routes.

4. Suggest route groups.

5. Recommend lazy loading.

6. Suggest authentication guards.

7. Include 404 and error routes.

8. Describe navigation flow.

9. generate React Router code.

Return a professional Routing Architecture document.
"""


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        (
            "human",
            """
Project:

{task}

Component Architecture:

{component_plan}
"""
        ),
    ]
)

chain = prompt | llm


def routing_agent(state: FrontendState):

    print("\n========== ROUTING AGENT ==========\n")

    response = chain.invoke(
        {
            "task": state["task"],
            "component_plan": state["component_plan"],
        }
    )

    return {
        "routing_plan": response.content
    }