#!/bin/bash
# Script to build and push FastAPI backend Docker image using Google Cloud Build
# Uses .dockerignore for faster builds and Docker layer caching for dependencies
PROJECT_ID=${PROJECT_ID:-blackletter-dev}
SERVICE_NAME=${SERVICE_NAME:-blackletter-backend}
IMAGE_NAME=gcr.io/$PROJECT_ID/$SERVICE_NAME

gcloud builds submit ./backend --tag $IMAGE_NAME
