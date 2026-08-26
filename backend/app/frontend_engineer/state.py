from typing import TypedDict, Dict, List


class FrontendState(TypedDict):
    task: str

    project_name: str
    frontend_framework: str
    styling_framework: str
    state_library: str
    routing_library: str

    project_plan: str

    ui_plan: str
    component_plan: str
    routing_plan: str
    state_plan: str
    api_plan: str
    styling_plan: str

    files: Dict[str, str]
    output_dir: str
    logs: List[str]
    errors: List[str]

    final_output: str