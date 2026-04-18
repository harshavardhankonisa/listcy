variable "app_name" {
  description = "Application name — used as a prefix for all AWS resource names"
  type        = string
  default     = "listcy"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "github_org" {
  description = "GitHub organisation or username that owns the repo"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "listcy"
}

variable "domain" {
  description = "Production domain (e.g. listcy.com) — used for ORIGIN and S3 CORS"
  type        = string
}

variable "ses_from_email" {
  description = "Verified SES sender address"
  type        = string
  default     = "noreply@listcy.com"
}

variable "ecs_cpu" {
  description = "ECS Fargate task CPU units (512 = 0.5 vCPU)"
  type        = number
  default     = 512
}

variable "ecs_memory" {
  description = "ECS Fargate task memory in MB"
  type        = number
  default     = 1024
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "listcydb"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "listcy"
}

variable "db_password" {
  description = "PostgreSQL master password — keep out of version control"
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.db_password) >= 8
    error_message = "RDS requires the master password to be at least 8 characters."
  }
}
