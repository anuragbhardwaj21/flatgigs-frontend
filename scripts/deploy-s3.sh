#!/usr/bin/env bash
set -euo pipefail

: "${S3_BUCKET:?S3_BUCKET is required}"
: "${AWS_REGION:?AWS_REGION is required}"

DIST_DIR="${DIST_DIR:-dist}"
INDEX_FILE="${DIST_DIR}/index.html"

if [[ ! -f "${INDEX_FILE}" ]]; then
  echo "error: ${INDEX_FILE} not found — run yarn build first" >&2
  exit 1
fi

S3_URI="s3://${S3_BUCKET}"
AWS_ARGS=(--region "${AWS_REGION}")

if [[ "${DRY_RUN:-}" == "1" ]]; then
  AWS_ARGS+=(--dryrun)
  echo "DRY_RUN enabled — no objects will be modified"
fi

echo "Deploying ${DIST_DIR}/ to ${S3_URI} (${AWS_REGION})"

aws s3 sync "${DIST_DIR}/" "${S3_URI}/" \
  "${AWS_ARGS[@]}" \
  --delete \
  --exclude "index.html" \
  --cache-control "public, max-age=31536000, immutable"

aws s3 cp "${INDEX_FILE}" "${S3_URI}/index.html" \
  "${AWS_ARGS[@]}" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate"

echo "Deploy complete: http://${S3_BUCKET}.s3-website-${AWS_REGION}.amazonaws.com"
