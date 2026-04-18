#!/bin/bash

set -euo pipefail

echo "[LocalStack] Creating S3 buckets..."

awslocal s3 mb s3://listcy-avatars
awslocal s3 mb s3://listcy-covers
awslocal s3 mb s3://listcy-uploads

for BUCKET in listcy-avatars listcy-covers listcy-uploads; do
  awslocal s3api put-bucket-cors \
    --bucket "${BUCKET}" \
    --cors-configuration '{
      "CORSRules": [{
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT"],
        "AllowedOrigins": ["http://localhost:3000"],
        "MaxAgeSeconds": 3000
      }]
    }'
done

echo "[LocalStack] S3 buckets ready."
