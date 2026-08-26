import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from .parser import parse_gcc_output

POSIX = sys.platform != "win32"
if POSIX:
    import resource

COMPILE_TIMEOUT_S = 15
RUN_TIMEOUT_S = 5

# Backstops behind the wall-clock timeouts above — bounds a single compile/run
# even if it doesn't hit the timeout first (e.g. a memory bomb that never
# blocks on CPU). POSIX-only: rlimits and the sandbox-user privilege drop
# below require Linux and are skipped entirely on local Windows dev.
COMPILE_CPU_LIMIT_S = 20
COMPILE_MEM_LIMIT_BYTES = 1024 * 1024 * 1024  # 1 GiB — g++ on heavy templates needs headroom
RUN_CPU_LIMIT_S = 5
RUN_MEM_LIMIT_BYTES = 256 * 1024 * 1024
RUN_FSIZE_LIMIT_BYTES = 10 * 1024 * 1024
RUN_NPROC_LIMIT = 4  # blocks fork bombs; std::thread doesn't count against this

# User the compiled binary runs as (created by the Dockerfile). Dropping to it
# requires the app process itself to run as root in the container — see the
# Dockerfile comment. On Windows/local dev this is unused.
SANDBOX_USER = os.environ.get("SANDBOX_USER", "sandbox")


def _find_gxx() -> str:
    found = shutil.which("g++")
    if found:
        return found
    # Local Windows dev: MSYS2 UCRT64's g++ isn't on PATH by default.
    msys2 = Path(r"C:\msys64\ucrt64\bin\g++.exe")
    if msys2.exists():
        return str(msys2)
    raise RuntimeError("g++ not found on PATH")


GXX = _find_gxx()
GXX_BIN_DIR = str(Path(GXX).parent)


def _compile_env():
    # g++ needs its own bin/ dir on PATH to find cc1plus/as/ld alongside itself.
    env = os.environ.copy()
    env["PATH"] = GXX_BIN_DIR + os.pathsep + env.get("PATH", "")
    return env


def _run_env():
    # Deliberately minimal: the untrusted binary must not be able to read
    # secrets (e.g. GEMINI_API_KEY) out of the process environment.
    if POSIX:
        return {"PATH": "/usr/bin:/bin"}
    return {"PATH": os.environ.get("PATH", "")}


def _compile_limits():
    resource.setrlimit(resource.RLIMIT_CPU, (COMPILE_CPU_LIMIT_S, COMPILE_CPU_LIMIT_S))
    resource.setrlimit(resource.RLIMIT_AS, (COMPILE_MEM_LIMIT_BYTES, COMPILE_MEM_LIMIT_BYTES))


def _run_limits():
    resource.setrlimit(resource.RLIMIT_CPU, (RUN_CPU_LIMIT_S, RUN_CPU_LIMIT_S))
    resource.setrlimit(resource.RLIMIT_AS, (RUN_MEM_LIMIT_BYTES, RUN_MEM_LIMIT_BYTES))
    resource.setrlimit(resource.RLIMIT_FSIZE, (RUN_FSIZE_LIMIT_BYTES, RUN_FSIZE_LIMIT_BYTES))
    resource.setrlimit(resource.RLIMIT_NPROC, (RUN_NPROC_LIMIT, RUN_NPROC_LIMIT))


def compile_and_run(code: str) -> dict:
    """Compiles untrusted C++ in a throwaway temp directory and, if it compiles,
    runs the binary with a timeout.

    Isolation: wall-clock timeouts (both steps) + POSIX rlimits (CPU, address
    space, output size, process count) on the run step + running the compiled
    binary as an unprivileged, no-login OS user with a stripped environment.
    This is rlimit/uid-based process isolation, not a full container/VM
    sandbox (no network namespace, no seccomp filter) — reasonable for a
    public demo, not for hosting genuinely adversarial workloads.
    """
    with tempfile.TemporaryDirectory(prefix="dsa_explainer_") as tmp:
        src = Path(tmp) / "main.cpp"
        src.write_text(code, encoding="utf-8")
        exe = Path(tmp) / ("main.exe" if not POSIX else "main")

        try:
            compile_result = subprocess.run(
                [GXX, "-std=c++17", "-Wall", str(src), "-o", str(exe)],
                capture_output=True, text=True, timeout=COMPILE_TIMEOUT_S, env=_compile_env(),
                preexec_fn=_compile_limits if POSIX else None,
            )
        except subprocess.TimeoutExpired:
            return {"success": False, "errors": [], "stdout": "", "raw": "Compilation timed out."}

        errors = parse_gcc_output(compile_result.stderr)

        if compile_result.returncode != 0 or not exe.exists():
            return {"success": False, "errors": errors, "stdout": "", "raw": compile_result.stderr}

        if POSIX:
            os.chmod(tmp, 0o755)
            os.chmod(exe, 0o755)

        run_kwargs = {}
        if POSIX:
            run_kwargs["preexec_fn"] = _run_limits
            run_kwargs["user"] = SANDBOX_USER
            run_kwargs["group"] = SANDBOX_USER

        try:
            run_result = subprocess.run(
                [str(exe)], capture_output=True, text=True, timeout=RUN_TIMEOUT_S,
                cwd=tmp, env=_run_env(), **run_kwargs,
            )
            stdout = run_result.stdout
            if run_result.stderr:
                stdout += ("\n" if stdout else "") + run_result.stderr
            if run_result.returncode != 0:
                stdout += f"\n[exited with code {run_result.returncode}]"
        except subprocess.TimeoutExpired:
            stdout = "[program timed out after 5s — possible infinite loop]"

        return {"success": True, "errors": errors, "stdout": stdout, "raw": compile_result.stderr}
