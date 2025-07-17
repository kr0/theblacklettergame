
variable "cloud_run_service_name" {
  description = "Name of the Cloud Run backend service."
  type        = string
  default     = "blackletter-backend"
}

variable "cloud_run_image" {
  description = "Container image for the Cloud Run backend service."
  type        = string
  default     = "gcr.io/blackletter-dev/blackletter-backend"
}

variable "firestore_admin_emails" {
  description = "List of emails allowed to write to Firestore rules collection."
  type        = list(string)
  default     = ["kelvin.jro@gmail.com"]
}
variable "support_email" {
  description = "Support email for OAuth consent screen."
  type        = string
  default     = "support@example.com"
}

# Project ID (used throughout infra)
variable "project_id" {
  description = "Google Cloud project ID (e.g. blackletter-dev)"
  type        = string
  default     = "blackletter-dev"
}
variable "region" {
  description = "Google Cloud region"
  type        = string
  default     = "us-central1"
}
variable "cloudrun_service_name" {
  description = "Cloud Run service name for backend"
  type        = string
  default     = "blackletter-backend"
}

variable "cloudrun_image" {
  description = "Docker image for Cloud Run backend"
  type        = string
  default     = "gcr.io/blackletter-dev/blackletter-backend"
}


variable "billing_account" {
  description = "GCP Billing Account ID (format: 000000-000000-000000)"
  type        = string
  default     = "01EF34-1F1526-D8304E"
}

variable "gamemaster_passphrase" {
  description = "Passphrase for gamemaster auth. Used for Google Secret Manager."
  type        = string
  default = "changeme"
}
