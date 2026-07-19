#!/usr/bin/env bash
# Deploys the personal website: CloudFormation stack, then site content.
set -euo pipefail
cd "$(dirname "$0")"

export AWS_PROFILE="${AWS_PROFILE:-auto_agent}"
export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-us-east-1}"
STACK_NAME=personal-website

echo "==> Deploying CloudFormation stack ($STACK_NAME)"
aws cloudformation deploy \
  --template-file infra/template.yml \
  --stack-name "$STACK_NAME" \
  --tags Project=personal_website \
  --no-fail-on-empty-changeset

outputs() {
  aws cloudformation describe-stacks --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}
BUCKET=$(outputs BucketName)
DIST_ID=$(outputs DistributionId)
SITE_URL=$(outputs SiteUrl)

echo "==> Building site"
npm run build

echo "==> Syncing dist/ to s3://$BUCKET"
aws s3 sync dist/ "s3://$BUCKET" --delete

echo "==> Invalidating CloudFront cache"
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*" \
  --query 'Invalidation.Id' --output text

echo "==> Done: $SITE_URL"
