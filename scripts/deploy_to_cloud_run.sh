#!/bin/bash
# Script to deploy FastAPI backend to Google Cloud Run

PROJECT_ID=${PROJECT_ID:-blackletter-dev}
REGION=${REGION:-us-central1}
SERVICE_NAME=${SERVICE_NAME:-blackletter-backend}
IMAGE_NAME=gcr.io/$PROJECT_ID/$SERVICE_NAME

# Use Terraform output for service account and image if available
SERVICE_ACCOUNT=$(terraform -chdir=../infra output -raw cloud_run_backend_service_account_email 2>/dev/null || echo "")
CLOUD_RUN_IMAGE=$(terraform -chdir=../infra output -raw cloud_run_image 2>/dev/null || echo "")
BLACKLETTER_ADMIN_EMAILS=$(terraform -chdir=../infra output -raw blackletter_admin_emails 2>/dev/null || echo "")

# Configure Docker to use Google Cloud credentials
gcloud auth configure-docker gcr.io




# Set only BLACKLETTER_ADMIN_EMAILS as env var. Cloud Run will use its own service account for credentials.
gcloud run deploy $SERVICE_NAME \
  --image ${CLOUD_RUN_IMAGE:-$IMAGE_NAME} \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars=BLACKLETTER_ADMIN_EMAILS=${BLACKLETTER_ADMIN_EMAILS} \
  $SA_FLAG

echo "Backend deployed to Cloud Run as $SERVICE_NAME in $REGION."
