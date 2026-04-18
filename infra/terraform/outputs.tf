output "alb_dns_name" {
  description = "Point your domain's A record (or CNAME) at this DNS name"
  value       = aws_lb.main.dns_name
}

output "ecr_repository_url" {
  description = "ECR image URI — referenced in the ECS task definition"
  value       = aws_ecr_repository.app.repository_url
}

output "github_deploy_role_arn" {
  description = "Add this as AWS_DEPLOY_ROLE_ARN in GitHub repository secrets"
  value       = aws_iam_role.github_deploy.arn
}

output "rds_endpoint" {
  description = "RDS host:port — use in the DATABASE_URL secret"
  value       = aws_db_instance.main.endpoint
}

output "sqs_image_processing_url" {
  value = aws_sqs_queue.image_processing.url
}

output "sqs_email_notifications_url" {
  value = aws_sqs_queue.email_notifications.url
}
