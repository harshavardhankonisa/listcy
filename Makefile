APP = listcy-main
DB  = listcy-db
DEV = infra/compose/docker-compose.development.yaml

.PHONY: up stop down reset build \
        logs logs-app logs-db \
        shell shell-db \
        lint lint-fix format format-all \
        db-push db-generate db-migrate db-studio \
        auth-schema

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

shell:
	docker exec -it $(APP) sh

shell-db:
	docker exec -it $(DB) psql -U listcy -d listcydb

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
