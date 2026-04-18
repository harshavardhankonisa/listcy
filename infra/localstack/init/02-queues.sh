#!/bin/bash

set -euo pipefail

echo "[LocalStack] Creating SQS queues..."

awslocal sqs create-queue --queue-name listcy-image-processing

awslocal sqs create-queue --queue-name listcy-email-notifications

echo "[LocalStack] SQS queues ready."
