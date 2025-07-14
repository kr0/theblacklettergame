
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


RULES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "rules"))

@app.get("/rules")
def list_rules():
    files = [f for f in os.listdir(RULES_DIR) if f.endswith(".md")]
    return {"rules": files}

@app.get("/rules/{rule_name}")
def get_rule(rule_name: str):
    file_path = os.path.join(RULES_DIR, rule_name)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Rule not found")
    return FileResponse(file_path, media_type="text/markdown")
