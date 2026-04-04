# Getting Started

## Prerequisites

| Tool           | Version                              |
| -------------- | ------------------------------------ |
| Docker         | Latest                               |
| Docker Compose | Latest (bundled with Docker Desktop) |

No local Node.js or npm required — everything runs inside the container.

---

## Setup

**1. Clone the repo**

```bash
git clone https://github.com/harshavardhankonisa/listcy.git
cd listcy
```

**2. Create your development env file**

```bash
cp infra/env/.env.development.example infra/env/.env.development
```

Fill in the required values (see [Environment Variables](#environment-variables) below).

**3. Start everything**

```bash
make up
```

This starts three containers:

- `listcy-main` — the Next.js app on port `3000`
- `listcy-db` — PostgreSQL 18 on port `5432`
- `listcy-studio` — Drizzle Studio on port `4983`

**4. Push the schema (first time only)**

```bash
make db-push
```

**5. Open the app**

- App → http://localhost:3000
- Drizzle Studio → http://localhost:4983

---

## Daily Workflow

```bash
make up          # Start all services
make down        # Stop and tear down
make stop        # Stop without removing (preserves DB data)
make logs        # Tail all logs
make logs-app    # Tail app logs only
make shell       # Shell into the app container
make shell-db    # psql into the DB
```

---

## All Commands

All commands run inside Docker — **make sure containers are running** (`make up`) before using them.

Use `make` or `npm run` — they are identical.

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

## Environment Variables

The dev env file lives at `infra/env/.env.development`.

| Variable               | Required | Description                                 |
| ---------------------- | -------- | ------------------------------------------- |
| `DATABASE_URL`         | ✅       | PostgreSQL connection string                |
| `BETTER_AUTH_SECRET`   | ✅       | Secret for Better Auth session signing      |
| `BETTER_AUTH_URL`      | ✅       | App base URL (e.g. `http://localhost:3000`) |
| `GITHUB_CLIENT_ID`     | —        | GitHub OAuth app client ID                  |
| `GITHUB_CLIENT_SECRET` | —        | GitHub OAuth app client secret              |
| `REDIS_URL`            | —        | Redis connection string                     |
| `S3_BUCKET`            | —        | AWS S3 bucket name                          |
| `S3_REGION`            | —        | AWS region                                  |
| `S3_ACCESS_KEY_ID`     | —        | AWS access key                              |
| `S3_SECRET_ACCESS_KEY` | —        | AWS secret key                              |

GitHub OAuth is optional — the app falls back to email/password only if not set.

---

## Auth

- Sign up at http://localhost:3000/auth/register
- Login at http://localhost:3000/auth/login
- GitHub OAuth available if env vars are set
