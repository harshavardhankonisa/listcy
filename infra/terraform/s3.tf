locals {
  buckets = toset(["avatars", "covers", "uploads"])
}

resource "aws_s3_bucket" "app" {
  for_each = local.buckets
  bucket   = "${var.app_name}-${each.key}"
}

resource "aws_s3_bucket_public_access_block" "app" {
  for_each = local.buckets
  bucket   = aws_s3_bucket.app[each.key].id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "app" {
  for_each = local.buckets
  bucket   = aws_s3_bucket.app[each.key].id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["https://${var.domain}"]
    max_age_seconds = 3000
  }
}
