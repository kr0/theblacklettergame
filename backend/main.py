from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from google.cloud import firestore
from google.api_core.exceptions import NotFound
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from fastapi import Request, status, Depends
from typing import List, Optional


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))


# Initialize Firebase Admin SDK (for verifying ID tokens)
if not firebase_admin._apps:
    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if cred_path:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Use default credentials (Cloud Run, GKE, GCE, etc.)
        firebase_admin.initialize_app()
RULES_COLLECTION = "rules"
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

class RuleCreateRequest(BaseModel):
    rule_name: str

class RuleSummary(BaseModel):
    name: str
    created_at: Optional[str]
    updated_at: Optional[str]

class ListRulesResponse(BaseModel):
    rules: List[RuleSummary]

class RuleMarkdownResponse(BaseModel):
    markdown: str

class SuccessResponse(BaseModel):
    success: bool
    created: Optional[str] = None
    deleted: Optional[str] = None

# Dependency to verify Firebase ID token (admin check now handled by Firestore rules)
async def get_current_firebase_user(request: Request):
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header")
    id_token = auth_header.split(" ", 1)[1]
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.get("/rules", response_model=ListRulesResponse)
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
        created_at = data.get("created_at")
        updated_at = data.get("updated_at")
        # Convert Firestore timestamp to ISO string if present
        if created_at is not None:
            created_at = created_at.isoformat()
        if updated_at is not None:
            updated_at = updated_at.isoformat()
        rules.append({
            "name": doc.id,
            "created_at": created_at,
            "updated_at": updated_at
        })
    return {"rules": rules}


@app.get("/rules/{rule_name}", response_model=RuleMarkdownResponse)
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


@app.post("/rules/{rule_name}/edit", response_model=SuccessResponse)
async def edit_rule(rule_name: str, req: RuleEditRequest = Body(...), user=Depends(get_current_firebase_user)):
    """
    Edit an existing rule's markdown in Firestore. No passphrase required.
    """
    doc_ref = firestore_client.collection(RULES_COLLECTION).document(rule_name)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Rule not found")
    doc_ref.set(
        {"markdown": req.markdown, "updated_at": firestore.SERVER_TIMESTAMP}, merge=True
    )
    return {"success": True}



# Create a new rule
@app.post("/rules", response_model=SuccessResponse)
async def create_rule(req: RuleCreateRequest = Body(...), user=Depends(get_current_firebase_user)):
    """
    Create a new rule with placeholder markdown. No passphrase required.
    """
    doc_ref = firestore_client.collection(RULES_COLLECTION).document(req.rule_name)
    if doc_ref.get().exists:
        raise HTTPException(status_code=400, detail="Rule already exists")
    doc_ref.set({"markdown": PLACEHOLDER_MARKDOWN, "created_at": firestore.SERVER_TIMESTAMP})
    return {"success": True, "created": req.rule_name}

# Delete a rule
@app.delete("/rules/{rule_name}", response_model=SuccessResponse)
async def delete_rule(rule_name: str, user=Depends(get_current_firebase_user)):
    """
    Delete a rule by name. No passphrase required.
    """
    doc_ref = firestore_client.collection(RULES_COLLECTION).document(rule_name)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Rule not found")
    doc_ref.delete()
    return {"success": True, "deleted": rule_name}
