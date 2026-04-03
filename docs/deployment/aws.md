# Deployment — AWS

Listcy is deployed as a Docker container on AWS. The production image is minimal — source code is never included.

---

## Docker Build

The production Dockerfile uses a multi-stage build:

```
infra/docker/Dockerfile.production
```

Stages:

1. **deps** — installs `node_modules`
2. **build** — runs `next build` with `output: 'standalone'`
3. **runner** — copies only `.next/standalone`, `.next/static`, and `public/`

The final image contains no source code.

---

## Starting Production

```bash
npm run prod:docker        # Build and start (detached)
npm run prod:docker:stop   # Stop
```

Or directly:

```bash
docker compose -f infra/compose/docker-compose.production.yaml up --build -d
```

---

## Environment Variables

All secrets are injected at runtime — **never baked into the image**.

Set these in your AWS environment (ECS task definition, EC2 user data, etc.):

| Variable               | Required | Notes                                      |
| ---------------------- | -------- | ------------------------------------------ |
| `DATABASE_URL`         | ✅       | Must use SSL in prod                       |
| `BETTER_AUTH_SECRET`   | ✅       | Long random string                         |
| `BETTER_AUTH_URL`      | ✅       | Public app URL (e.g. `https://listcy.com`) |
| `GITHUB_CLIENT_ID`     | —        | OAuth                                      |
| `GITHUB_CLIENT_SECRET` | —        | OAuth                                      |
| `REDIS_URL`            | —        | For caching and rate limiting              |
| `S3_BUCKET`            | —        | File storage                               |
| `S3_REGION`            | —        |                                            |
| `S3_ACCESS_KEY_ID`     | —        |                                            |
| `S3_SECRET_ACCESS_KEY` | —        |                                            |

---

## Infrastructure

| Service                 | Purpose                   |
| ----------------------- | ------------------------- |
| AWS ECS / EC2           | Runs the Docker container |
| AWS RDS (PostgreSQL)    | Production database       |
| AWS ElastiCache (Redis) | Caching and rate limiting |
| AWS S3                  | File and image storage    |

---

## Database in Production

- Always use SSL — no `rejectUnauthorized: false`
- Use `npm run db:generate` + `npm run db:migrate` for schema changes
- Never use `db:push` in production
