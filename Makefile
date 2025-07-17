# Makefile for blackletter project

.PHONY: backend
backend:
	cd backend \
	&& python3 -m venv ../.venv \
	&& ../.venv/bin/pip install --upgrade pip \
	&& ../.venv/bin/pip install -r requirements.txt \
	&& ../.venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

.PHONY: frontend
frontend:
	cd frontend && npm run dev

.PHONY: build
build:
	bash scripts/build_backend_image.sh &
	bash scripts/build_frontend.sh &
	wait

.PHONY: deploy
deploy:
	bash scripts/deploy_to_cloud_run.sh & bash scripts/deploy_frontend.sh & wait

.PHONY: build-backend
build-backend:
	bash scripts/build_backend_image.sh

.PHONY: build-frontend
build-frontend:
	bash scripts/build_frontend.sh

.PHONY: deploy-backend
deploy-backend:
	bash scripts/deploy_to_cloud_run.sh

.PHONY: deploy-frontend
deploy-frontend:
	bash scripts/deploy_frontend.sh


.PHONY: infra
infra:
	cd infra && terraform init && terraform apply

.PHONY: login
login:
	gcloud config set project blackletter-dev
	gcloud auth application-default login




