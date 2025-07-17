# ------------------------------------------------------------------------------
# Terraform Provider Configuration
# ------------------------------------------------------------------------------

terraform {
    required_providers {
        google-beta = {
            source  = "hashicorp/google-beta"
            version = ">= 6.0"
        }
    }
}

# Provider with user_project_override enabled (for quota checks)
provider "google-beta" {
    project               = var.project_id
    region                = var.region
}

# Provider with user_project_override disabled (for certain API enablement)
# provider "google-beta" {
#     alias                 = "no_user_project_override"
#     project               = var.project_id
#     region                = var.region
#     user_project_override = false
# }

# ------------------------------------------------------------------------------
# Google Cloud Project and API Enablement
# ------------------------------------------------------------------------------

# Manage the existing Google Cloud project for BlackLetter Dev
resource "google_project" "default" {
    project_id      = var.project_id
    name            = "Black Letter Dev"
    org_id          = null
    billing_account = var.billing_account
    labels = {
        "firebase" = "enabled"
    }
}

# Enable required GCP and Firebase APIs for the project
resource "google_project_service" "default" {
    provider = google-beta
    project  = google_project.default.project_id
    for_each = toset([
        "cloudbilling.googleapis.com",
        "cloudresourcemanager.googleapis.com",
        "firebase.googleapis.com",
        "serviceusage.googleapis.com",
        "run.googleapis.com",
        "cloudbuild.googleapis.com",
        "firestore.googleapis.com",
        "secretmanager.googleapis.com",
        "identitytoolkit.googleapis.com", # Firebase Auth/Identity Platform
        "cloudidentity.googleapis.com"     # Cloud Identity
    ])
    service            = each.key
    disable_on_destroy = false
}

# ------------------------------------------------------------------------------
# Service Accounts and IAM Roles
# ------------------------------------------------------------------------------

# Service account for GitHub Actions CI/CD
resource "google_service_account" "github_actions" {
    account_id   = "github-action-1018144373"
    display_name = "GitHub Actions Service Account"
    project      = var.project_id
}

# Assign required IAM roles to the GitHub Actions service account
resource "google_project_iam_member" "github_actions_roles" {
    for_each = toset([
        "roles/firebasehosting.admin",
        "roles/iam.serviceAccountUser"
    ])
    project = var.project_id
    role    = each.key
    member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# ------------------------------------------------------------------------------
# Firebase Project and Web App Configuration
# ------------------------------------------------------------------------------

# Enable Firebase services for the project
resource "google_firebase_project" "default" {
    provider   = google-beta
    project    = google_project.default.project_id
    depends_on = [
        google_project_service.default
    ]
}

# Register a Firebase Web App for the frontend
resource "google_firebase_web_app" "frontend" {
    provider     = google-beta
    project      = var.project_id
    display_name = "BlackLetter Frontend"
    depends_on   = [ google_firebase_project.default ]
}

# ------------------------------------------------------------------------------
# Firestore Database
# ------------------------------------------------------------------------------

resource "google_firestore_database" "default" {
  project     = var.project_id
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"
}

# ------------------------------------------------------------------------------
# Secret Manager
# ------------------------------------------------------------------------------

# Create a secret for the gamemaster passphrase
resource "google_secret_manager_secret" "gamemaster_passphrase" {
    secret_id = "GAMEMASTER_PASSPHRASE"
    project   = var.project_id
    replication {
        auto {}
    }
}

# Store the initial version of the gamemaster passphrase secret
resource "google_secret_manager_secret_version" "gamemaster_passphrase_version" {
    secret      = google_secret_manager_secret.gamemaster_passphrase.id
    secret_data = var.gamemaster_passphrase
}
