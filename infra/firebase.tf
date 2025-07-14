// firebase.tf - Terraform configuration for Firebase Hosting

# Enables Firebase services for the new project created above.
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id
  depends_on = [
    google_project_service.default
  ]
}

resource "google_firebase_web_app" "frontend" {
  provider     = google-beta
  project      = var.project_name
  display_name = "BlackLetter Frontend"
  depends_on = [ google_firebase_project.default ]
}
