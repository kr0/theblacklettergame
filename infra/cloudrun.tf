resource "google_cloud_run_service" "backend" {
  name     = var.cloud_run_service_name
  location = var.region
  project  = var.project_id
  template {
    spec {
      service_account_name = google_service_account.cloud_run_backend.email
      containers {
        image = var.cloud_run_image
        ports {
          container_port = 8080
        }
        env {
          name  = "BLACKLETTER_ADMIN_EMAILS"
          value = var.blackletter_admin_emails
        }
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
  autogenerate_revision_name = true
}

# Artifact Registry repository for Docker images
resource "google_artifact_registry_repository" "docker_repo" {
  provider      = google-beta
  project       = var.project_id
  location      = var.region
  repository_id = "blackletter-repo"
  description   = "Docker repository for BlackLetter"
  format        = "DOCKER"
}

# Service account for Cloud Run backend
resource "google_service_account" "cloud_run_backend" {
  account_id   = "cloudrun-backend-sa"
  display_name = "Cloud Run Backend Service Account"
  project      = var.project_id
}

# Grant required permissions to Cloud Run backend service account
resource "google_project_iam_member" "cloud_run_backend_roles" {
  for_each = {
    firestore_user      = "roles/datastore.user"
    firebase_token      = "roles/iam.serviceAccountTokenCreator"
    logging_writer      = "roles/logging.logWriter"
    secret_accessor     = "roles/secretmanager.secretAccessor"
  }
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.cloud_run_backend.email}"
}

# This allows public access to the Cloud Run service.
resource "google_cloud_run_service_iam_member" "noauth" {
  project = var.project_id
  service  = google_cloud_run_service.backend.name
  location = google_cloud_run_service.backend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
