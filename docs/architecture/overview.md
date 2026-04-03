# Architecture Overview

Listcy uses a strict layered backend. Every request flows through the same chain — no skipping, no going backwards.

```
Route Handlers → Services → Repositories → Schema
    (HTTP)       (Business)    (CRUD)        (DB)
```

> Controllers layer exists in `src/api/controllers/` but is currently empty — auth/authz logic lives in route handlers for now. It will be filled in as the project grows.

---

## Layers

### 1. Route Handlers — `src/app/api/`

Thin HTTP wrappers. Their only job is to parse the request, call a service, and return a `NextResponse`.

```
src/app/api/
├── lists/
│   ├── route.ts          # GET /api/lists, POST /api/lists
│   └── [id]/
│       ├── route.ts      # GET, PATCH, DELETE /api/lists/[id]
│       └── items/
│           └── route.ts  # POST /api/lists/[id]/items
├── collections/
│   ├── route.ts          # GET /api/collections, POST /api/collections
│   └── [id]/
│       ├── route.ts      # GET, PATCH, DELETE /api/collections/[id]
│       └── lists/
│           └── route.ts  # POST, DELETE /api/collections/[id]/lists
├── tags/
│   └── route.ts          # GET /api/tags
└── user/
    ├── profile/route.ts  # GET, PATCH /api/user/profile
    └── settings/route.ts # GET, PATCH /api/user/settings
```

**Rules:**

- NEVER put business logic here
- NEVER access DB or repositories directly
- Always call `requireSession()` for protected routes
- Return `NextResponse.json(...)` only

---

### 2. Services — `src/api/services/`

Pure business logic. Ownership checks, data orchestration, permission enforcement.

| File                    | Responsibility                                             |
| ----------------------- | ---------------------------------------------------------- |
| `list.service.ts`       | Lists + list items CRUD, tag assignment, visibility checks |
| `collection.service.ts` | Collections CRUD, adding/removing lists, tag assignment    |
| `tag.service.ts`        | Tag listing, find-or-create                                |
| `user.service.ts`       | User profile and settings upsert                           |

**Rules:**

- Call repositories only — never import DB client or schemas directly
- Own the ownership check (e.g. `if (found.userId !== userId) return null`)
- No HTTP awareness — no `Request`, `Response`, or status codes

---

### 3. Repositories — `src/api/repositories/`

Basic CRUD against a single schema domain using Drizzle ORM.

| File                       | Tables touched                                          |
| -------------------------- | ------------------------------------------------------- |
| `list.repository.ts`       | `list`, `list_item`, `list_to_tag`                      |
| `collection.repository.ts` | `collection`, `collection_to_list`, `collection_to_tag` |
| `tag.repository.ts`        | `tag`                                                   |
| `user.repository.ts`       | `user_profile`, `user_settings`                         |

**Rules:**

- No business logic, no auth checks
- Return raw data — no transformation
- One domain per file

---

### 4. Schema — `src/api/schemas/`

Drizzle table definitions and relations. Source of truth for the DB.

| File                    | Tables defined                                                     |
| ----------------------- | ------------------------------------------------------------------ |
| `auth.schema.ts`        | `user`, `session`, `account`, `verification` (Better Auth managed) |
| `lists.schema.ts`       | `list`, `list_item`                                                |
| `collections.schema.ts` | `collection`, `collection_to_list`                                 |
| `tags.schema.ts`        | `tag`, `list_to_tag`, `collection_to_tag`                          |
| `users.schema.ts`       | `user_profile`, `user_settings`                                    |
| `index.ts`              | Barrel re-export of all schemas                                    |

**Rules:**

- Schema files import each other via **direct relative imports** to avoid circular deps
- External consumers use the barrel: `import { list } from '@/api/schemas'`

---

### 5. Hooks — `src/api/hooks/`

Lifecycle event system for Better Auth database events. Completely decoupled from the request cycle.

Currently: on user creation → bootstraps `user_profile` and `user_settings` records.

**Rules:**

- Hooks call Services, never Repositories directly
- No HTTP awareness

---

## Import Direction

```
Route Handlers
      ↓
   Services
      ↓
  Repositories
      ↓
    Schema
      ↑
  Constants   ← shared by all layers
```

Never import upward. Never skip a layer.
