// secrets.tf - Google Secret Manager for RULE_EDITOR_PASSPHRASE
resource "google_secret_manager_secret" "gamemaster_passphrase" {
  secret_id = "GAMEMASTER_PASSPHRASE"
  project   = var.project_name
  replication {
    auto {
      
    }
  }
}

resource "google_secret_manager_secret_version" "gamemaster_passphrase_version" {
  secret      = google_secret_manager_secret.gamemaster_passphrase.id
  secret_data = var.gamemaster_passphrase
}
