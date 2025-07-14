// outputs.tf - Terraform outputs
// ...placeholder for output definitions...
output "cloudrun_url" {
  description = "URL of the deployed Cloud Run backend service"
  value       = google_cloud_run_service.backend.status[0].url
}

output "artifact_registry_repo" {
  description = "Artifact Registry Docker repository name"
  value       = google_artifact_registry_repository.docker_repo.id
}

output "frontend_firebase_hosting_url_web_app" {
  description = "URL for the Firebase hosted frontend (.web.app)"
  value       = "https://blackletter-dev.web.app"
}

output "frontend_firebase_hosting_url_firebaseapp" {
  description = "URL for the Firebase hosted frontend (.firebaseapp.com)"
  value       = "https://blackletter-dev.firebaseapp.com"
}
