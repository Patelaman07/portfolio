@echo off
cd /d "%~dp0"
echo Starting backend on :8000 and a Cloudflare quick tunnel...
echo The tunnel window will print a new https://*.trycloudflare.com URL every
echo time you run this - copy it into Vercel's VITE_AGENT_API_URL /
echo VITE_FRONTEND_ENGINEER_API_URL env vars and into this backend's
echo ALLOWED_ORIGINS, then redeploy the frontend.
echo.
start "Portfolio Backend" cmd /k ".venv\Scripts\python.exe -m uvicorn app.main:app --port 8000"
start "Cloudflare Tunnel" cmd /k ""C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:8000"
