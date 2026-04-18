resource "aws_secretsmanager_secret" "database_url" {
  name = "${var.app_name}/production/database-url"
}

resource "aws_secretsmanager_secret" "better_auth_secret" {
  name = "${var.app_name}/production/better-auth-secret"
}

resource "aws_secretsmanager_secret" "github_oauth" {
  name = "${var.app_name}/production/github-oauth"
}

resource "aws_secretsmanager_secret" "origin" {
  name = "${var.app_name}/production/origin"
}

resource "aws_secretsmanager_secret_version" "origin" {
  secret_id     = aws_secretsmanager_secret.origin.id
  secret_string = "https://${var.domain}"
}

resource "aws_secretsmanager_secret" "sqs_urls" {
  name = "${var.app_name}/production/sqs-urls"
}

resource "aws_secretsmanager_secret_version" "sqs_urls" {
  secret_id = aws_secretsmanager_secret.sqs_urls.id
  secret_string = jsonencode({
    image_processing    = aws_sqs_queue.image_processing.url
    email_notifications = aws_sqs_queue.email_notifications.url
  })
}
