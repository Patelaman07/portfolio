@echo off
cd /d "%~dp0"
echo Starting Portfolio Agent + AI Frontend Engineer + Error Explainer backend on :8000
echo (Requires GEMINI_API_KEY set in backend\.env)
echo.
.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
