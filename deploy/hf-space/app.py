"""Hugging Face Space entrypoint (Gradio SDK, ZeroGPU hardware).

Docker and CPU-basic Spaces need a paid plan on this account, so the portfolio's
FastAPI backend runs inside a free ZeroGPU Gradio Space. ZeroGPU only starts a
Space whose Gradio app is launched with demo.launch() and has a @spaces.GPU
function, so Gradio owns the server and the backend is mounted under /backend:

    https://<space>.hf.space/backend/api/health

Point the frontend's VITE_*_API_URL at https://<space>.hf.space/backend.
The backend is cloned from GitHub at startup; restart the Space to pick up new commits.
"""
import spaces  # must be imported before anything that could touch CUDA

import os
import subprocess
import sys

REPO = "https://github.com/Patelaman07/portfolio"
SRC = "/tmp/portfolio"

# This container runs as root, so the C++ explainer drops compiled binaries to
# an unprivileged "sandbox" user — create it here, as the backend's Dockerfile does.
if os.geteuid() == 0:
    subprocess.run(
        ["useradd", "--no-create-home", "--shell", "/usr/sbin/nologin", "sandbox"],
        stderr=subprocess.DEVNULL,
    )

if not os.path.isdir(SRC):
    subprocess.run(["git", "clone", "--depth", "1", REPO, SRC], check=True)

# The backend package is also named `app`, so it must win over this file.
sys.path.insert(0, os.path.join(SRC, "backend"))

import gradio as gr  # noqa: E402
from starlette.routing import Mount  # noqa: E402

from app.main import app as backend  # noqa: E402


@spaces.GPU(duration=5)
def gpu_ping():
    # Never needed by the portfolio; exists only to satisfy ZeroGPU's startup check.
    return "ok"


with gr.Blocks(title="Portfolio backend") as demo:
    gr.Markdown(
        "# Aman Patel — portfolio backend\n"
        "FastAPI API for the AI Portfolio Agent, AI Frontend Engineer and "
        "C++ Error Explainer. Health check: [/backend/api/health](/backend/api/health)."
    )
    ping_out = gr.Textbox(label="GPU ping")
    gr.Button("Ping").click(gpu_ping, outputs=ping_out)

# SSR off: otherwise Gradio's Node front server owns the public port and only
# proxies Gradio's own paths, so /backend would never reach Python.
server_app, _, _ = demo.launch(prevent_thread_lock=True, ssr_mode=False)
# Put the backend first so none of Gradio's own routes can shadow it.
server_app.router.routes.insert(0, Mount("/backend", app=backend))
demo.block_thread()
