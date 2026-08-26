from pathlib import Path

from ..state import FrontendState


OUTPUT_ROOT = Path(__file__).resolve().parent.parent.parent.parent / "output"


def _slugify(name: str) -> str:
    name = (name or "").strip().lower() or "generated-app"
    return "".join(c if c.isalnum() or c in "-_" else "-" for c in name)


def write_output(state: FrontendState):

    print("\n========== WRITE OUTPUT ==========\n")

    project_name = _slugify(state.get("project_name"))
    output_dir = OUTPUT_ROOT / project_name

    files = state.get("files", {})

    # Best-effort: the API response is served from `files` in memory (see
    # frontend_engineer_routes.py), so a read-only/ephemeral container
    # filesystem shouldn't take the pipeline down over this.
    written = 0
    try:
        for rel_path, content in files.items():
            full_path = output_dir / rel_path
            full_path.parent.mkdir(parents=True, exist_ok=True)
            full_path.write_text(content, encoding="utf-8")
            print(f"  wrote {full_path}")
            written += 1
    except OSError as e:
        print(f"  skipped writing to disk ({e})")

    return {
        "output_dir": str(output_dir),
        "logs": state.get("logs", []) + [f"Wrote {written}/{len(files)} files to {output_dir}"],
    }
