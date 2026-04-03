# Database

Listcy uses **PostgreSQL 18** with **Drizzle ORM**.

---

## Schema Location

All table definitions live in `src/api/schemas/`:

| File                    | Tables                                       |
| ----------------------- | -------------------------------------------- |
| `auth.schema.ts`        | `user`, `session`, `account`, `verification` |
| `lists.schema.ts`       | `list`, `list_item`                          |
| `collections.schema.ts` | `collection`, `collection_to_list`           |
| `tags.schema.ts`        | `tag`, `list_to_tag`, `collection_to_tag`    |
| `users.schema.ts`       | `user_profile`, `user_settings`              |

---

## Making Schema Changes

### Development (db:push)

In development, push schema changes directly — no migration files generated:

```bash
npm run db:push
```

This introspects the current DB and applies the diff. Safe to use when iterating locally.

### Production (generate + migrate)

In production, always generate and run migrations:

```bash
npm run db:generate   # Creates SQL migration files in /drizzle
npm run db:migrate    # Applies pending migrations to the DB
```

Never use `db:push` in production.

---

## Drizzle Studio

A visual DB browser runs alongside the app in dev:

```
http://localhost:4983
```

It starts automatically with `make up`. To start it manually:

```bash
npm run db:studio
```

---

## Regenerating the Auth Schema

Better Auth manages its own tables (`user`, `session`, `account`, `verification`). If you change the Better Auth config, regenerate its schema file:

```bash
npm run auth:schema
```

This writes to `src/api/schemas/auth.schema.ts`. Do not manually edit that file.

---

## Connection

The DB connection is configured in `src/api/config/db.ts`. It reads `DATABASE_URL` from the environment.

Development connection string (from compose):

```
postgresql://listcy:listcy@postgres:5432/listcydb
```

Production must use a proper SSL connection. See [deployment docs](../deployment/aws.md).
