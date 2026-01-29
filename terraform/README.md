# Terraform AWS Deploy: MyMovieWatchlist

This Terraform stack deploys the frontend (Nginx) and backend (Node/Express) as ECS Fargate services behind an Application Load Balancer (ALB). Path-based routing sends `/` to the frontend and `/api/*` to the backend. Secrets are read from SSM Parameter Store.

## Prerequisites
- AWS account and IAM user with permissions for ECR, ECS, IAM, VPC, ALB, CloudWatch Logs, SSM.
- AWS CLI configured (`aws configure`) for the target account + region.
- Terraform v1.6+ installed.
- Docker installed (to build/push images).
- SSM parameters created for:
  - `mongo_uri_ssm_name` (SecureString)
  - `jwt_secret_ssm_name` (SecureString)
  - `tmdb_api_key_ssm_name` (SecureString)

## Quick Start

1. Initialize Terraform:

```bash
cd infra
terraform init
```

2. Plan your deployment (replace values as needed):

```bash
terraform plan \
  -var "aws_region=us-east-1" \
  -var "mongo_uri_ssm_name=/mywatchlist/mongo_uri" \
  -var "jwt_secret_ssm_name=/mywatchlist/jwt_secret" \
  -var "tmdb_api_key_ssm_name=/mywatchlist/tmdb_api_key" \
  -var "frontend_image_tag=prod" \
  -var "backend_image_tag=prod"
```

3. Apply infrastructure (creates ECR, VPC, ALB, ECS):

```bash
terraform apply \
  -var "aws_region=us-east-1" \
  -var "mongo_uri_ssm_name=/mywatchlist/mongo_uri" \
  -var "jwt_secret_ssm_name=/mywatchlist/jwt_secret" \
  -var "tmdb_api_key_ssm_name=/mywatchlist/tmdb_api_key" \
  -var "frontend_image_tag=prod" \
  -var "backend_image_tag=prod"
```

4. Build and push Docker images to ECR (WSL):
   - Get output ECR URLs and ALB DNS:

```bash
terraform output
```

   - Login to ECR and push images:

```bash
# Set region
REGION=us-east-1

# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(terraform output -raw ecr_frontend_repo | sed 's/\/.*$//')
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(terraform output -raw ecr_backend_repo | sed 's/\/.*$//')

# Build frontend with backend URL pointing to ALB (HTTP)
ALB_DNS=$(terraform output -raw alb_dns_name)

# Frontend build uses VITE_BACKEND_URL at build time
cd ../frontend
docker build --build-arg VITE_BACKEND_URL="http://$ALB_DNS" -t $(terraform -chdir=../infra output -raw ecr_frontend_repo):prod .

docker push $(terraform -chdir=../infra output -raw ecr_frontend_repo):prod

# Backend
cd ../backend
# Ensure package.json runs server on PORT 5000; secrets come from SSM
docker build -t $(terraform -chdir=../infra output -raw ecr_backend_repo):prod .

docker push $(terraform -chdir=../infra output -raw ecr_backend_repo):prod
```

5. Update services to use the new image tags (if you change tags):

```bash
cd ../infra
terraform apply -var "frontend_image_tag=prod" -var "backend_image_tag=prod"
```

## HTTPS (optional)
- Request/validate an ACM certificate in the same region.
- Set `enable_https=true` and provide `certificate_arn`.
- Add an HTTPS listener in Terraform (port 443) mirroring the HTTP rules.
- Point your domain DNS (Route53 or external) to the ALB DNS.

## Notes
- Frontend calls the backend at `/api/*`; the ALB listener rule forwards those paths to the backend service.
- Backend health check is `/api/health`.
- ECS tasks run in public subnets with public IPs for simplicity; you can move them to private subnets + NAT for a production setup.
- Secrets are not stored in Terraform state; only their SSM names are referenced.
