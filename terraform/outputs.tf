output "alb_dns_name" {
  description = "Application Load Balancer DNS"
  value       = aws_lb.app.dns_name
}

output "ecr_frontend_repo" {
  description = "Frontend ECR repository URL"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecr_backend_repo" {
  description = "Backend ECR repository URL"
  value       = aws_ecr_repository.backend.repository_url
}
