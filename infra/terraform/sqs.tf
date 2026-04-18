resource "aws_sqs_queue" "image_processing" {
  name = "${var.app_name}-image-processing"

  visibility_timeout_seconds = 300
  message_retention_seconds  = 86400
}

resource "aws_sqs_queue" "email_notifications" {
  name = "${var.app_name}-email-notifications"

  visibility_timeout_seconds = 60
  message_retention_seconds  = 86400
}

resource "aws_sns_topic" "user_events" {
  name = "${var.app_name}-user-events"
}

resource "aws_sns_topic" "list_events" {
  name = "${var.app_name}-list-events"
}
