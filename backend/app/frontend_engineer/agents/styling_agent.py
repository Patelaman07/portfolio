from langchain_core.prompts import ChatPromptTemplate

from ..llm import llm
from ..state import FrontendState


SYSTEM_PROMPT = """
You are a Senior Frontend Styling Architect.

Your ONLY responsibility is creating the styling architecture.

Given the frontend project, UI architecture, and component architecture:

1. Design the overall design system.

2. Recommend a color palette.

3. Recommend typography.

4. Define spacing rules.

5. Define border radius rules.

6. Define shadows.

7. Define responsive breakpoints.

8. Recommend reusable utility classes.

9. Recommend animation strategy.

10. Define dark/light themes.

11. Recommend accessibility styling.

12. Suggest styling best practices.

13. generate Tailwind CSS.

14. generate CSS.

Return a professional Styling Architecture document.
"""


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        (
            "human",
            """
Frontend Project

{task}

UI Architecture

{ui_plan}

Component Architecture

{component_plan}
"""
        ),
    ]
)

chain = prompt | llm


def styling_agent(state: FrontendState):

    print("\n========== STYLING AGENT ==========\n")

    response = chain.invoke(
        {
            "task": state["task"],
            "ui_plan": state["ui_plan"],
            "component_plan": state["component_plan"],
        }
    )

    return {
        "styling_plan": response.content
    }