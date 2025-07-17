# Dockerfile for FastAPI backend
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .



ENV PYTHONUNBUFFERED=1
EXPOSE 8080
CMD bash -c 'uvicorn main:app --host 0.0.0.0 --port "${PORT:-8080}"'
