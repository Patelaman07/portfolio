FROM python:3.13-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ \
    && rm -rf /var/lib/apt/lists/*

# No-login user the error explainer drops into before running compiled,
# untrusted C++ (see app/error_explainer/compiler.py). The main server
# process stays as root so it has permission to make that privilege drop —
# that's container-root, not host-root, and it's confined to this image.
RUN useradd --no-create-home --shell /usr/sbin/nologin sandbox

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
