output "cloud_run_backend_service_account_email" {
  description = "Email of the Cloud Run backend service account."
  value       = google_service_account.cloud_run_backend.email
}
output "gamemaster_passphrase_secret_id" {
  description = "Secret Manager secret id for GAMEMASTER_PASSPHRASE used by backend."
  value       = google_secret_manager_secret.gamemaster_passphrase.secret_id
}
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
