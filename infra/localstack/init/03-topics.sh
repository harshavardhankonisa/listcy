#!/bin/bash

set -euo pipefail

echo "[LocalStack] Creating SNS topics..."

awslocal sns create-topic --name listcy-user-events
awslocal sns create-topic --name listcy-list-events

echo "[LocalStack] SNS topics ready."
