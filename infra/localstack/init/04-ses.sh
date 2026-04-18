#!/bin/bash

set -euo pipefail

echo "[LocalStack] Verifying SES email identities..."

awslocal ses verify-email-identity --email-address noreply@listcy.com
awslocal ses verify-email-identity --email-address support@listcy.com

echo "[LocalStack] SES identities ready."
