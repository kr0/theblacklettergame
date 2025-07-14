// variables.tf - Terraform variables
// ...placeholder for variable definitions...
variable "project_name" {
  description = "Google Cloud project name"
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
