import json
from dataclasses import dataclass
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"


@dataclass
class Document:
    id: str
    category: str
    source: str
    text: str


def _load(name: str):
    with open(DATA_DIR / f"{name}.json", encoding="utf-8") as f:
        return json.load(f)


def build_documents() -> list[Document]:
    docs: list[Document] = []

    profile = _load("profile")
    docs.append(Document(
        id="profile",
        category="profile",
        source="About",
        text=(
            f"{profile['name']} is a {profile['title']} based in {profile['location']}. "
            f"Focus: {profile['focus']}. Core stack: {', '.join(profile['core_stack'])}. "
            f"Agent framework: {profile['agent_framework']}. Languages: {', '.join(profile['languages'])}. "
            f"Open to: {profile['open_to']}. Education: {profile.get('education', '')}. "
            f"Achievements: {', '.join(profile.get('achievements', []))}. Contact email: {profile.get('email', '')}. "
            f"GitHub: {profile.get('github', '')}. LinkedIn: {profile.get('linkedin', '')}. "
            f"{profile['summary']}"
        ),
    ))

    for group in _load("skills"):
        items = ", ".join(f"{i['name']} (level {i['level']}/4)" for i in group["items"])
        docs.append(Document(
            id=f"skill-{group['title'].lower().replace(' / ', '-').replace(' ', '-')}",
            category="skills",
            source="Skills matrix",
            text=f"{group['title']} skills: {items}.",
        ))

    for entry in _load("resume"):
        docs.append(Document(
            id=f"resume-{entry['title'].lower().replace(' ', '-').replace(',', '')}",
            category="resume",
            source=f"Resume · {entry['title']}",
            text=f"{entry['when']} — {entry['title']} at {entry['where']}. {entry['text']}",
        ))

    for p in _load("projects"):
        text = (
            f"{p['name']} ({p['badge']}). Tags: {', '.join(p['tags'])}. "
            f"Problem: {p['problem']} Solution: {p['solution']} Architecture: {p['arch']} "
            f"Tech stack: {', '.join(p['stack'])}. Features: {', '.join(p['features'])}. "
            f"Live demo: {p['demo']} Engineering decisions: {p['decisions']}"
        )
        docs.append(Document(
            id=f"project-{p['id']}",
            category="project",
            source=f"{p['name']} · case study",
            text=text,
        ))

    return docs
