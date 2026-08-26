from langchain_core.prompts import ChatPromptTemplate

from ..llm import llm
from ..state import FrontendState


SYSTEM_PROMPT = """
You are a Senior React Architect.

Your responsibility is ONLY component architecture.

Using the given UI plan:

1. Identify every React component.

2. Organize components into folders.

3. Describe each component.

4. Define parent-child hierarchy.

5. Suggest props.

6. Identify reusable components.

7. Suggest layout components.

8. generate React code.

9. generate CSS.

Return a professional Component Architecture document.
"""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        (
            "human",
            """
Frontend Project:

{task}

UI Plan:

{ui_plan}
"""
        )
    ]
)

chain = prompt | llm


def component_agent(state: FrontendState):

    print("\n========== COMPONENT AGENT ==========\n")

    response = chain.invoke(
        {
            "task": state["task"],
            "ui_plan": state["ui_plan"],
        }
    )

    return {
        "component_plan": response.content
    }