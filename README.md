# Listcy

> A curated platform for creating, discovering, and sharing structured lists — turning rankings, resources, and collections into searchable, high-value content assets.

Built with **Next.js 16**, **Drizzle ORM**, **Better Auth**, **PostgreSQL**, **Tailwind CSS v4**. Runs entirely in Docker.

---

## Quick Start

**Prerequisites:** Docker and Docker Compose only. No local Node.js needed.

```bash
# 1. Copy the env template and fill in your values
cp infra/env/.env.development.example infra/env/.env.development

# 2. Start everything (app + postgres + drizzle studio)
make up

# 3. Push the schema to the DB (first time only)
make db-push
```

App → http://localhost:3000
Drizzle Studio → http://localhost:4983

---

## Commands

Everything runs inside Docker. Use `make` or `npm run` — they are identical.

| `make`             | `npm run`             | What it does                       |
| ------------------ | --------------------- | ---------------------------------- |
| `make up`          | `npm run up`          | Build and start all dev services   |
| `make stop`        | `npm run stop`        | Stop containers, keep data         |
| `make down`        | `npm run down`        | Stop and remove containers         |
| `make reset`       | `npm run reset`       | Tear down including volumes        |
| `make prod`        | `npm run prod:up`     | Start production build (detached)  |
| `make prod-stop`   | `npm run prod:stop`   | Stop production containers         |
| `make logs`        | —                     | Tail all logs                      |
| `make logs-app`    | —                     | Tail app logs only                 |
| `make shell`       | —                     | Shell into the app container       |
| `make shell-db`    | —                     | psql into the database             |
| `make lint`        | `npm run lint`        | Run ESLint                         |
| `make lint-fix`    | `npm run lint:fix`    | ESLint with auto-fix               |
| `make format`      | `npm run format`      | Run Prettier                       |
| `make format-all`  | `npm run format:all`  | ESLint + Prettier                  |
| `make db-push`     | `npm run db:push`     | Push schema changes to DB (dev)    |
| `make db-generate` | `npm run db:generate` | Generate migration files           |
| `make db-migrate`  | `npm run db:migrate`  | Run migrations (prod)              |
| `make db-studio`   | `npm run db:studio`   | Open Drizzle Studio                |
| `make auth-schema` | `npm run auth:schema` | Regenerate Better Auth schema file |

---

## Tech Stack

| Layer                   | Technology                                  |
| ----------------------- | ------------------------------------------- |
| Framework               | Next.js 16 (App Router)                     |
| Language                | TypeScript 5                                |
| Database                | PostgreSQL 18                               |
| ORM                     | Drizzle ORM                                 |
| Auth                    | Better Auth (email/password + GitHub OAuth) |
| Styling                 | Tailwind CSS v4                             |
| Caching / Rate-limiting | Redis                                       |
| File Storage            | AWS S3                                      |
| Runtime                 | Node.js ≥ 24                                |
| Infrastructure          | Docker (dev + prod)                         |

---

## Project Structure

```
src/
├── api/          # Server-only backend (controllers, services, repositories, schemas)
├── app/          # Next.js App Router (pages + API route handlers)
├── client/       # Client-side React components and hooks
└── constants/    # Shared constants and derived types (safe for server + client)
```

See [docs/architecture/overview.md](docs/architecture/overview.md) for the full layered architecture.

---

## Docs

|                                                        |                                                    |
| ------------------------------------------------------ | -------------------------------------------------- |
| [Architecture](docs/architecture/overview.md)          | Layered backend, import rules                      |
| [Conventions](docs/architecture/conventions.md)        | File naming, schema barrel, server/client boundary |
| [API Reference](docs/api/)                             | All endpoints documented                           |
| [Getting Started](docs/development/getting-started.md) | Detailed local setup                               |
| [Database](docs/development/database.md)               | Drizzle, migrations, Studio                        |
| [Commits](docs/development/commits.md)                 | Commit message convention                          |
| [Deployment](docs/deployment/aws.md)                   | Docker build + AWS                                 |
| [Security](docs/security/rules.md)                     | Security rules and checklist                       |
