# Makefile for blackletter project

.PHONY: backend frontend

backend:
	cd backend && uvicorn main:app --reload

frontend:
	cd frontend && npm run dev
