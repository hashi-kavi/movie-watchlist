variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "movie-watchlist"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "desired_count_frontend" {
  description = "Desired task count for frontend"
  type        = number
  default     = 1
}

variable "desired_count_backend" {
  description = "Desired task count for backend"
  type        = number
  default     = 1
}

variable "frontend_image_tag" {
  description = "Frontend image tag to deploy"
  type        = string
  default     = "latest"
}

variable "backend_image_tag" {
  description = "Backend image tag to deploy"
  type        = string
  default     = "latest"
}

variable "mongo_uri_ssm_name" {
  description = "SSM Parameter name holding MongoDB URI"
  type        = string
}

variable "jwt_secret_ssm_name" {
  description = "SSM Parameter name holding JWT secret"
  type        = string
}

variable "tmdb_api_key_ssm_name" {
  description = "SSM Parameter name holding TMDB API key"
  type        = string
}

variable "enable_https" {
  description = "Enable HTTPS with ACM cert (requires domain)"
  type        = bool
  default     = false
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default     = ""
}

variable "allowed_cidrs" {
  description = "CIDR blocks allowed to access the ALB (set to your IP for lockdown: e.g. [\"111.223.179.158/32\"])"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
