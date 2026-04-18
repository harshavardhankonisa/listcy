#!/bin/bash

set -euo pipefail

echo "[LocalStack] Creating Secrets Manager entries..."

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

put() {
  local name=$1 value=$2
  printf '%s' "$value" > "$TMP"
  awslocal secretsmanager create-secret --name "$name" --secret-string "file://$TMP"
}

put "listcy/development/database-url"      "postgresql://listcy:listcy@postgres:5432/listcydb"
put "listcy/development/better-auth-secret" "dev-secret-replace-in-production"
put "listcy/development/origin"            "http://localhost:3000"
put "listcy/development/github-oauth"      '{"client_id":"","client_secret":""}'
put "listcy/development/sqs-urls"          '{"image_processing":"http://localstack:4566/000000000000/listcy-image-processing","email_notifications":"http://localstack:4566/000000000000/listcy-email-notifications"}'

echo "[LocalStack] Secrets ready."
