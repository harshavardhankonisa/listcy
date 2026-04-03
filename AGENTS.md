<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# Listcy — AI Agent Codebase Guide

## Project Overview

Listcy is a list-curation platform ("YouTube for lists"). Users create Lists (ordered items),
group them into Collections, and tag both with Tags. Built with Next.js 16, Drizzle ORM,
Better Auth, PostgreSQL, and Tailwind CSS v4. Deployed on AWS as a Docker monorepo.

---

## Architecture (Strict Layered Backend)

```
Route Handlers → Controllers → Services → Repositories → Schema
         (HTTP)    (Auth/Authz)  (Business)    (CRUD)       (DB)
```

### Layer Rules — NEVER violate these:

1. **Route Handlers** (`src/app/api/`)
   - Thin wrappers. Parse request, call controller, return NextResponse.
   - NEVER contain auth logic, business logic, or direct DB access.

2. **Controllers** (`src/api/controllers/`)
   - Handle authentication (who is calling?) and authorization (are they allowed?).
   - Call `requireSession()` from auth middleware here.
   - Validate input shape. Delegate business logic to Services.
   - NEVER access repositories or DB directly.

3. **Services** (`src/api/services/`)
   - Pure business logic. Ownership checks, permission logic, data orchestration.
   - Call Repositories only. NEVER import schemas or DB client directly.
   - NEVER handle HTTP concerns (Request, Response, status codes).

4. **Repositories** (`src/api/repositories/`)
   - Basic CRUD operations using Drizzle ORM against a single schema domain.
   - NEVER contain business logic or authorization checks.
   - Return raw data — no HTTP awareness.

5. **Schema** (`src/api/schemas/`)
   - Drizzle table definitions and relations. Source of truth for DB structure.
   - Schema files cross-reference each other via direct imports (NOT the barrel export)
     to avoid circular dependencies.
   - External consumers use the barrel: `import { list } from '@/api/schemas'`

6. **Hooks** (`src/api/hooks/`)
   - Separate system for lifecycle events (e.g., user creation → bootstrap profile/settings).
   - Hooks listen to Better Auth database events. They call Services, never Repositories directly.
   - Completely decoupled from the request/response cycle.

### Import Direction (MUST follow):

```
Routes → Controllers → Services → Repositories → Schema
                                                     ↑
                                              Constants (shared)
```

Never import upward. Never skip layers.

---

## Folder Structure

```
src/
├── api/                          # Backend (server-only)
│   ├── config/                   # Infrastructure: auth, db, redis, s3
│   ├── controllers/              # Auth/Authz layer (between Routes and Services)
│   ├── hooks/                    # Better Auth lifecycle hooks
│   ├── middlewares/              # Reusable middleware (auth, rate-limit)
│   ├── repositories/             # Drizzle CRUD per domain
│   ├── schemas/                  # Drizzle table + relation definitions
│   │   └── index.ts              # Barrel export for external consumers
│   ├── services/                 # Business logic per domain
│   ├── types/                    # Shared backend TypeScript types
│   ├── utils/                    # Backend utility functions
│   └── validators/               # Input validation (Zod schemas)
├── app/                          # Next.js App Router
│   ├── api/                      # Route Handlers (thin HTTP wrappers)
│   ├── auth/                     # Auth pages (login, register, forgot-password)
│   ├── settings/                 # Settings pages
│   └── page.tsx                  # Home page (server component)
├── client/                       # Client-side React (browser-only)
│   ├── components/               # UI components organized by domain
│   │   ├── common/               # Shared components (ListCard, CategoryChips)
│   │   ├── layout/               # Shell, Header, Sidebar
│   │   ├── providers/            # Context providers (Theme)
│   │   └── settings/             # Settings-specific components
│   ├── config/                   # Client-side config (auth client)
│   └── hooks/                    # Client-side React hooks
├── constants/                    # Shared constants + derived types
│   ├── list.ts                   # VISIBILITIES, Visibility type
│   └── user.ts                   # THEMES, LOCALES, TIMEZONES + types
└── scripts/                      # CLI scripts (migrations, seeds, etc.)
```

---

## Key Conventions

### Constants & Types

- Derived types MUST live with their constants in `src/constants/`.
- Example: `Visibility` type lives in `src/constants/list.ts`, NOT in schema files.
- Import: `import type { Visibility } from '@/constants/list'`

### Schema Barrel Export

- `src/api/schemas/index.ts` re-exports ALL schema files.
- Internal schema files MUST use direct imports to avoid circular deps:
  `import { user } from './auth.schema'` ← correct inside schemas
- External files SHOULD use the barrel: `import { list } from '@/api/schemas'`

### File Naming

- Schema files: plural (`lists.schema.ts`, `collections.schema.ts`)
- Repository/Service/Controller files: singular (`list.repository.ts`, `list.service.ts`)
- One domain per file. Separate files for lists, collections, tags, users.

### Server/Client Boundary

- `src/api/` is server-only. MUST use `server-only` package guard.
- `src/client/` is client-side. Components use `'use client'` directive.
- `src/constants/` is shared — safe for both server and client.
- NEVER import from `src/api/` in `src/client/` components.
- Server Components in `src/app/` CAN import from `src/api/` directly.

---

## Development Workflow

```bash
make up       # Start all services (app + postgres + drizzle studio)
make down     # Stop all services
make shell    # Shell into the app container
make logs     # Tail all logs
make logs-app # Tail app logs only
make logs-db  # Tail postgres logs only
make shell-db # psql into the DB container
```

### Database

- Schema push for dev: `npm run db:push`
- Migrations for prod: `npm run db:generate` + `npm run db:migrate`
- Drizzle Studio: http://localhost:4983

### Auth

- Better Auth with email/password + GitHub OAuth
- Session-based authentication via `requireSession()` middleware
- User creation triggers hooks that bootstrap profile + settings

---

## Security Rules

1. ALL `src/api/` files MUST import `server-only` at the top of entry points
   (`config/db.ts`, `config/auth.ts`) to prevent accidental client bundling.
2. Environment variables with secrets MUST NOT have defaults in code.
3. Production DB connections MUST use proper SSL (not `rejectUnauthorized: false`).
4. Input validation on ALL route handlers — validate with Zod before processing.
5. Rate limiting on auth endpoints and write operations.
6. Ownership checks in Service layer for all mutation operations.
