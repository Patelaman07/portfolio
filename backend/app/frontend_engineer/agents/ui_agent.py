from langchain_core.prompts import ChatPromptTemplate

from ..llm import llm
from ..state import FrontendState


SYSTEM_PROMPT = """
You are a Senior Frontend UI Architect.

Your ONLY responsibility is planning the UI.

Given a frontend project:

1. Identify every page.

2. Describe the purpose of each page.

3. Design the navigation structure.

4. Suggest reusable UI sections.

5. Describe layouts.

6. Mention responsive behavior.

7. Mention accessibility improvements.

8. Suggest icons if necessary.

9. generate React code.

10. generate CSS.

11. generate Components.

Return a professional UI Architecture document.
"""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        ("human", "{task}")
    ]
)

chain = prompt | llm


def ui_agent(state: FrontendState):

    print("\n========== UI AGENT ==========\n")

    response = chain.invoke(
        {
            "task": state["task"]
        }
    )

    return {
        "ui_plan": response.content
    }