#!/bin/bash
# Script to deploy FastAPI backend to Google Cloud Run
PROJECT_ID=${PROJECT_ID:-blackletter-dev}
REGION=${REGION:-us-central1}
SERVICE_NAME=${SERVICE_NAME:-blackletter-backend}
IMAGE_NAME=gcr.io/$PROJECT_ID/$SERVICE_NAME

# Configure Docker to use Google Cloud credentials
gcloud auth configure-docker gcr.io

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated

echo "Backend deployed to Cloud Run as $SERVICE_NAME in $REGION."
