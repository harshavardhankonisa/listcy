APP        = listcy-main
DB         = listcy-db
LOCALSTACK = listcy-localstack
DEV        = infra/compose/docker-compose.development.yaml
TF         = infra/terraform

.PHONY: up stop down reset build \
        logs logs-app logs-db logs-aws \
        shell shell-db shell-aws \
        lint lint-fix format format-all \
        db-push db-generate db-migrate db-studio \
        auth-schema \
        tf-state-bootstrap tf-init tf-plan tf-apply tf-destroy tf-output

up:
	docker compose -f $(DEV) up

stop:
	docker compose -f $(DEV) stop

down:
	docker compose -f $(DEV) down

reset:
	docker compose -f $(DEV) down -v

build:
	docker compose -f $(DEV) build

logs:
	docker compose -f $(DEV) logs -f

logs-app:
	docker compose -f $(DEV) logs -f app

logs-db:
	docker compose -f $(DEV) logs -f postgres

logs-aws:
	docker compose -f $(DEV) logs -f localstack

shell:
	docker exec -it $(APP) sh

shell-db:
	docker exec -it $(DB) psql -U listcy -d listcydb

shell-aws:
	docker exec -it $(LOCALSTACK) awslocal s3 ls

lint:
	docker exec $(APP) npx eslint .

lint-fix:
	docker exec $(APP) npx eslint --fix .

format:
	docker exec $(APP) npx prettier --write .

format-all:
	docker exec $(APP) npx eslint --fix . && docker exec $(APP) npx prettier --write .

db-push:
	docker exec -it $(APP) npx drizzle-kit push

db-generate:
	docker exec -it $(APP) npx drizzle-kit generate

db-migrate:
	docker exec -it $(APP) npx drizzle-kit migrate

db-studio:
	docker exec -it $(APP) npx drizzle-kit studio --host 0.0.0.0

auth-schema:
	docker exec $(APP) npx auth@latest generate --config src/api/config/auth.ts --output src/api/schemas/auth.schema.ts --yes

tf-state-bootstrap:
	bash infra/scripts/tf-state-bootstrap.sh

tf-init:
	cd $(TF) && terraform init

tf-plan:
	cd $(TF) && terraform plan

tf-apply:
	cd $(TF) && terraform apply

tf-destroy:
	cd $(TF) && terraform destroy

tf-output:
	cd $(TF) && terraform output

tf-first-deploy:
	$(eval ACCOUNT_ID := $(shell aws sts get-caller-identity --query Account --output text))
	$(eval ECR_URI := $(ACCOUNT_ID).dkr.ecr.us-east-1.amazonaws.com/listcy)
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(ECR_URI)
	docker build -f infra/docker/Dockerfile.production -t $(ECR_URI):latest .
	docker push $(ECR_URI):latest
	cd $(TF) && terraform apply
