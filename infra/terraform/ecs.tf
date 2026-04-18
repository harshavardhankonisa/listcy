resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name       = aws_ecs_cluster.main.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
}

resource "aws_ecs_task_definition" "app" {
  family                   = var.app_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name      = "${var.app_name}-app"
    image     = "${aws_ecr_repository.app.repository_url}:latest"
    essential = true

    portMappings = [{ containerPort = 3000, protocol = "tcp" }]

    environment = [
      { name = "NODE_ENV",       value = "production" },
      { name = "PORT",           value = "3000" },
      { name = "HOSTNAME",       value = "0.0.0.0" },
      { name = "AWS_REGION",     value = var.region },
      { name = "S3_BUCKET",      value = "${var.app_name}-avatars" },
      { name = "SES_FROM_EMAIL", value = var.ses_from_email },
    ]

    secrets = [
      { name = "DATABASE_URL",                valueFrom = aws_secretsmanager_secret.database_url.arn },
      { name = "BETTER_AUTH_SECRET",          valueFrom = aws_secretsmanager_secret.better_auth_secret.arn },
      { name = "ORIGIN",                      valueFrom = aws_secretsmanager_secret.origin.arn },
      { name = "GITHUB_CLIENT_ID",            valueFrom = "${aws_secretsmanager_secret.github_oauth.arn}:client_id::" },
      { name = "GITHUB_CLIENT_SECRET",        valueFrom = "${aws_secretsmanager_secret.github_oauth.arn}:client_secret::" },
      { name = "SQS_IMAGE_PROCESSING_URL",    valueFrom = "${aws_secretsmanager_secret.sqs_urls.arn}:image_processing::" },
      { name = "SQS_EMAIL_NOTIFICATIONS_URL", valueFrom = "${aws_secretsmanager_secret.sqs_urls.arn}:email_notifications::" },
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
        "awslogs-region"        = var.region
        "awslogs-stream-prefix" = "ecs"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "wget -qO- http://localhost:3000/ || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])

  # GitHub Actions updates the image tag on every push to main.
  # Terraform ignores container_definitions so CI deploys don't fight with `terraform apply`.
  lifecycle {
    ignore_changes = [container_definitions]
  }
}

resource "aws_ecs_service" "app" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.app.id]
    assign_public_ip = false  # sits behind NAT, not exposed directly
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "${var.app_name}-app"
    container_port   = 3000
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true 
  }

  depends_on = [aws_lb_listener.http]
}
