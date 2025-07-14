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
          container_port = 80
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
