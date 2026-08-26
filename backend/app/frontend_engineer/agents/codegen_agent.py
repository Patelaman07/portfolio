import re

from langchain_core.prompts import ChatPromptTemplate

from ..llm import llm
from ..state import FrontendState


# ------------------------
# Fixed file manifest for the generic demo app
# (Vite + React 18 + React Router v6 + Zustand + Axios + Tailwind CSS)
# ------------------------

FILE_MANIFEST = [
    {
        "path": "src/index.css",
        "purpose": "Global stylesheet importing Tailwind's base, components, and utilities layers, plus a couple of small base resets.",
        "context": ["styling_plan"],
    },
    {
        "path": "src/App.jsx",
        "purpose": "Root App component that renders the app's routes via <AppRoutes /> imported from ./router.",
        "context": ["routing_plan"],
    },
    {
        "path": "src/router/index.jsx",
        "purpose": "AppRoutes component defining React Router v6 <Routes>: '/' renders LoginPage (public); '/dashboard' and '/profile' are nested under a ProtectedRoute wrapper and render DashboardPage and ProfilePage; any unmatched path renders NotFoundPage.",
        "context": ["routing_plan", "component_plan"],
    },
    {
        "path": "src/components/ProtectedRoute.jsx",
        "purpose": "A ProtectedRoute component that reads isAuthenticated from useAuthStore (src/store/authStore.js); if not authenticated it redirects to '/' using <Navigate>, otherwise it renders <Outlet />.",
        "context": ["state_plan"],
    },
    {
        "path": "src/components/Navbar.jsx",
        "purpose": "Top navigation bar showing the app title, links to Dashboard and Profile, and a logout button that calls the logout action from useAuthStore and navigates to '/'.",
        "context": ["ui_plan", "styling_plan"],
    },
    {
        "path": "src/components/Sidebar.jsx",
        "purpose": "Sidebar navigation component with links to Dashboard and Profile, styled with Tailwind CSS utility classes.",
        "context": ["ui_plan", "styling_plan"],
    },
    {
        "path": "src/components/Button.jsx",
        "purpose": "Reusable Button component accepting children, onClick, a variant prop ('primary' | 'secondary'), and disabled, styled with Tailwind CSS.",
        "context": ["styling_plan"],
    },
    {
        "path": "src/pages/LoginPage.jsx",
        "purpose": "Login page with a controlled email/password form that calls authService.login on submit, stores the returned user via useAuthStore's login action, and navigates to '/dashboard' on success. Shows a simple error message on failure.",
        "context": ["ui_plan", "api_plan", "state_plan"],
    },
    {
        "path": "src/pages/DashboardPage.jsx",
        "purpose": "Dashboard page rendered after login. Renders <Navbar /> and <Sidebar />, and a grid of a few example summary/stat cards with placeholder demo data.",
        "context": ["ui_plan", "component_plan"],
    },
    {
        "path": "src/pages/ProfilePage.jsx",
        "purpose": "Profile page rendering <Navbar />, showing the current user's info from useAuthStore, and a logout button.",
        "context": ["ui_plan", "state_plan"],
    },
    {
        "path": "src/pages/NotFoundPage.jsx",
        "purpose": "Simple 404 Not Found page with a message and a link back to '/'.",
        "context": [],
    },
    {
        "path": "src/store/authStore.js",
        "purpose": "Zustand store named useAuthStore exposing { user, isAuthenticated, login(user), logout() }, persisting the user to localStorage so a page refresh keeps the session.",
        "context": ["state_plan"],
    },
    {
        "path": "src/api/client.js",
        "purpose": "Axios instance configured with baseURL from import.meta.env.VITE_API_BASE_URL (fallback 'http://localhost:8000/api'), JSON headers, and a request interceptor that attaches a bearer token from localStorage if present.",
        "context": ["api_plan"],
    },
    {
        "path": "src/api/authService.js",
        "purpose": "authService module exporting async login(email, password) and logout() functions that call the shared axios client at POST /auth/login and POST /auth/logout.",
        "context": ["api_plan"],
    },
    {
        "path": "src/api/userService.js",
        "purpose": "userService module exporting async getCurrentUser() that calls the shared axios client at GET /users/me.",
        "context": ["api_plan"],
    },
]


CODEGEN_SYSTEM_PROMPT = """
You are a Senior Frontend Engineer generating a single source file for a real,
working React + Vite project.

Rules:
- Output ONLY the raw file content for the requested file.
- Do NOT include explanations or comments about what you are doing.
- Do NOT wrap the output in markdown code fences (no ``` anywhere).
- The code must be syntactically valid and consistent with a
  Vite + React 18 + React Router v6 + Zustand + Axios + Tailwind CSS stack.
- Keep the implementation simple, working, and self-contained. Use
  placeholder/demo data where a real backend would otherwise be required.
"""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", CODEGEN_SYSTEM_PROMPT),
        (
            "human",
            """
File path: {path}

Purpose:
{purpose}

Relevant architecture context:
{context}

Generate the complete content for this file now.
""",
        ),
    ]
)

chain = prompt | llm


def _build_context(state: FrontendState, keys, max_len: int = 1500) -> str:
    parts = []
    for key in keys:
        value = state.get(key) or ""
        if value:
            parts.append(f"[{key}]\n{value[:max_len]}")
    return "\n\n".join(parts) if parts else "N/A"


def _strip_code_fences(text: str) -> str:
    text = text.strip()
    lines = text.splitlines()
    if lines and lines[0].strip().startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].strip() == "```":
        lines = lines[:-1]
    text = "\n".join(lines).strip()
    text = re.sub(r"^```[a-zA-Z0-9]*\n?", "", text)
    return text.strip() + "\n"


def codegen_agent(state: FrontendState):

    print("\n========== CODEGEN AGENT ==========\n")

    files = {}

    for entry in FILE_MANIFEST:
        path = entry["path"]
        print(f"  generating {path} ...")

        context = _build_context(state, entry.get("context", []))

        response = chain.invoke(
            {
                "path": path,
                "purpose": entry["purpose"],
                "context": context,
            }
        )

        files[path] = _strip_code_fences(response.content)

    return {
        "files": files,
        "logs": state.get("logs", []) + [f"Generated {len(files)} files."],
    }
