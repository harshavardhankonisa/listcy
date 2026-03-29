APP = listcy-main
DB  = listcy-db
DEV = infra/compose/docker-compose.development.yaml

up:
	docker compose -f $(DEV) up

build:
	docker compose -f $(DEV) build

stop:
	docker compose -f $(DEV) stop

down:
	docker compose -f $(DEV) down

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
