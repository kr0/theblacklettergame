# FastAPI Hello World (Backend)

This project is now located in the `backend` folder. It is a minimal FastAPI application with a single endpoint that returns "Hello, World!".

## How to Run

1. Install dependencies:
   ```bash
   pip install fastapi uvicorn
   ```
2. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
3. Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

## Endpoint
- `GET /` returns `{ "message": "Hello, World!" }`
