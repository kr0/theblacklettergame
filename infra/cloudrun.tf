resource "google_project_iam_member" "cloudrun_secret_accessor" {
  project = var.project_name
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_cloud_run_service.backend.template.0.spec.0.service_account_name}"
}
// cloudrun.tf - Terraform configuration for Google Cloud Run and Artifact Registry
resource "google_artifact_registry_repository" "docker_repo" {
  provider      = google-beta
  project       = var.project_name
  location      = var.region
  repository_id = "blackletter-repo"
  description   = "Docker repository for BlackLetter"
  format        = "DOCKER"
}

resource "google_cloud_run_service" "backend" {
  name     = var.cloudrun_service_name
  location = var.region
  project  = var.project_name

  template {
    spec {
      containers {
        image = var.cloudrun_image
        ports {
          container_port = 8080 # Cloud Run expects 8080
        }
        env {
          name = "GAMEMASTER_PASSPHRASE"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.gamemaster_passphrase.secret_id
              key  = "latest"
            }
          }
        }
      }
    }
  }
  # Allow unauthenticated invocations

  traffic {
    percent         = 100
    latest_revision = true
  }

  autogenerate_revision_name = true
}

resource "google_cloud_run_service_iam_member" "noauth" {
  project = var.project_name
  service  = google_cloud_run_service.backend.name
  location = google_cloud_run_service.backend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_project_iam_member" "cloudrun_firestore_access" {
  project = var.project_name
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_cloud_run_service.backend.template.0.spec.0.service_account_name}"
}
