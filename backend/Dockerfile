# Dockerfile for FastAPI backend
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .


# For production, use Google Secret Manager to inject GAMEMASTER_PASSPHRASE
# See https://cloud.google.com/run/docs/configuring/secrets
# The deploy script should fetch the secret and set the env var in Cloud Run.

ENV PYTHONUNBUFFERED=1
EXPOSE 8080
CMD bash -c 'uvicorn main:app --host 0.0.0.0 --port "${PORT:-8080}"'
