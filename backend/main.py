from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from google.cloud import firestore
from google.api_core.exceptions import NotFound


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
RULES_COLLECTION = "rules"
PASSPHRASE = os.environ.get(
    "GAMEMASTER_PASSPHRASE", "blackletter123"
)  # Set in env for production
PLACEHOLDER_MARKDOWN = """# New Rule\n\nThis is a placeholder for your new rule. Edit this markdown to add your content."""


# Initialize FastAPI app
app = FastAPI()

# Initialize Firestore client
firestore_client = firestore.Client()

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define pydantic models for requests and responses
class RuleEditRequest(BaseModel):
    markdown: str
    passphrase: str


class RuleCreateRequest(BaseModel):
    rule_name: str
    passphrase: str


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.get("/rules")
def list_rules():
    """
    List all rules in the Firestore collection, sorted by creation date descending.
    Returns a list of objects: {name, created_at, updated_at}
    """
    rules_ref = firestore_client.collection(RULES_COLLECTION)
    docs = rules_ref.order_by("created_at", direction=firestore.Query.DESCENDING).stream()
    rules = []
    for doc in docs:
        data = doc.to_dict()
        rules.append({
            "name": doc.id,
            "created_at": data.get("created_at"),
            "updated_at": data.get("updated_at")
        })
    return {"rules": rules}


@app.get("/rules/{rule_name}")
def get_rule(rule_name: str):
    """
    Retrieve a rule's markdown from Firestore.
    """
    doc_ref = firestore_client.collection(RULES_COLLECTION).document(rule_name)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Rule not found")
    data = doc.to_dict()
    return {"markdown": data.get("markdown", "")}


@app.post("/rules/{rule_name}/edit")
def edit_rule(rule_name: str, req: RuleEditRequest = Body(...)):
    """
    Edit an existing rule's markdown in Firestore. Requires passphrase.
    """
    if req.passphrase != PASSPHRASE:
        raise HTTPException(status_code=403, detail="Invalid passphrase")
    doc_ref = firestore_client.collection(RULES_COLLECTION).document(rule_name)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Rule not found")
    doc_ref.set(
        {"markdown": req.markdown, "updated_at": firestore.SERVER_TIMESTAMP}, merge=True
    )
    return {"success": True}



# Create a new rule
@app.post("/rules")
def create_rule(req: RuleCreateRequest = Body(...)):
    """
    Create a new rule with placeholder markdown. Requires passphrase.
    """
    if req.passphrase != PASSPHRASE:
        raise HTTPException(status_code=403, detail="Invalid passphrase")
    doc_ref = firestore_client.collection(RULES_COLLECTION).document(req.rule_name)
    if doc_ref.get().exists:
        raise HTTPException(status_code=400, detail="Rule already exists")
    doc_ref.set({"markdown": PLACEHOLDER_MARKDOWN, "created_at": firestore.SERVER_TIMESTAMP})
    return {"success": True, "created": req.rule_name}

# Delete a rule
@app.delete("/rules/{rule_name}")
def delete_rule(rule_name: str, passphrase: str = Body(..., embed=True)):
    """
    Delete a rule by name. Requires passphrase.
    """
    if passphrase != PASSPHRASE:
        raise HTTPException(status_code=403, detail="Invalid passphrase")
    doc_ref = firestore_client.collection(RULES_COLLECTION).document(rule_name)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Rule not found")
    doc_ref.delete()
    return {"success": True, "deleted": rule_name}
