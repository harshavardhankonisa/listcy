# Getting Started

## Prerequisites

| Tool           | Version                              |
| -------------- | ------------------------------------ |
| Docker         | Latest                               |
| Docker Compose | Latest (bundled with Docker Desktop) |
| Node.js        | ≥ 24.13.0                            |
| npm            | ≥ 11.6.2                             |

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
npm run db:push
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

## Useful npm Scripts

All scripts that run inside the container use `docker exec` — **make sure the containers are running** before calling them.

```bash
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier
npm run format:all   # ESLint + Prettier together
npm run db:push      # Push schema to DB (dev)
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations (prod)
npm run db:studio    # Start Drizzle Studio
npm run auth:schema  # Regenerate Better Auth schema file
```

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
