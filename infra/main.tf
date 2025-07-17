# Create Firestore database in Native mode
resource "google_firestore_database" "database" {
  project     = var.project_name
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"
}
# Terraform configuration to set up providers by version.
terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = ">= 6.0"
    }
  }
}

# Configures the provider to use the resource block's specified project for quota checks.
provider "google-beta" {
  project               = var.project_name
  region                = var.region
  user_project_override = true
}

# Configures the provider to not use the resource block's specified project for quota checks.
provider "google-beta" {
  alias                = "no_user_project_override"
  project              = var.project_name
  region               = var.region
  user_project_override = false
}

# References an existing Google Cloud project for BlackLetter Dev.

# Manage the existing Google Cloud project for BlackLetter Dev.
resource "google_project" "default" {
  project_id      = var.project_name
  name            = "Black Letter Dev"
  org_id          = null # Set to your organization ID if needed
  billing_account = var.billing_account
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs for Firebase and GCP integration.
resource "google_project_service" "default" {
  provider = google-beta.no_user_project_override
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
  ])
  service            = each.key
  disable_on_destroy = false
}

# Service account for GitHub Actions Firebase Hosting deploys
resource "google_service_account" "github_actions" {
  account_id   = "github-action-1018144373"
  display_name = "GitHub Actions Service Account"
  project      = var.project_name
}

# Grant Firebase Hosting Admin role
resource "google_project_iam_member" "github_actions_hosting_admin" {
  project = var.project_name
  role    = "roles/firebasehosting.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Grant Service Account User role
resource "google_project_iam_member" "github_actions_sa_user" {
  project = var.project_name
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}
