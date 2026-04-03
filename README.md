# Listcy

> YouTube for lists. Create ordered lists, group them into collections, and tag everything.

Built with **Next.js 16**, **Drizzle ORM**, **Better Auth**, **PostgreSQL**, **Tailwind CSS v4**. Runs entirely in Docker.

---

## Quick Start

**Prerequisites:** Docker, Docker Compose, Node.js ≥ 24, npm ≥ 11

```bash
# 1. Copy the env template and fill in your values
cp infra/env/.env.development.example infra/env/.env.development

# 2. Start everything (app + postgres + drizzle studio)
make up

# 3. Push the schema to the DB (first time only)
npm run db:push
```

App → http://localhost:3000
Drizzle Studio → http://localhost:4983

---

## Development Commands

| Command               | What it does                 |
| --------------------- | ---------------------------- |
| `make up`             | Start all services           |
| `make down`           | Stop and remove containers   |
| `make stop`           | Stop containers, keep data   |
| `make logs`           | Tail all logs                |
| `make logs-app`       | Tail app logs only           |
| `make shell`          | Shell into the app container |
| `make shell-db`       | psql into the database       |
| `npm run db:push`     | Push schema changes (dev)    |
| `npm run db:generate` | Generate migration files     |
| `npm run db:migrate`  | Run migrations (prod)        |
| `npm run lint`        | Run ESLint                   |
| `npm run format`      | Run Prettier                 |

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
