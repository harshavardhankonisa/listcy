# Conventions

---

## File Naming

| Type             | Pattern      | Examples                                                     |
| ---------------- | ------------ | ------------------------------------------------------------ |
| Schema files     | **plural**   | `lists.schema.ts`, `collections.schema.ts`, `tags.schema.ts` |
| Repository files | **singular** | `list.repository.ts`, `collection.repository.ts`             |
| Service files    | **singular** | `list.service.ts`, `user.service.ts`                         |
| Controller files | **singular** | `list.controller.ts`                                         |
| Validator files  | by concern   | `text.ts`                                                    |

One domain per file. Never mix lists and collections in the same service/repository file.

---

## Constants & Derived Types

Derived types **must** live with their constants in `src/constants/`, not in schema files.

```
src/constants/
├── list.ts    # VISIBILITIES array + Visibility type
└── user.ts    # THEMES, LOCALES, TIMEZONES arrays + Theme, Locale, Timezone types
```

**Correct:**

```ts
// src/constants/list.ts
export const VISIBILITIES = ['public', 'private'] as const
export type Visibility = (typeof VISIBILITIES)[number]

// Anywhere that needs it:
import type { Visibility } from '@/constants/list'
```

**Wrong:**

```ts
// ❌ Don't define types inside schema files
export type Visibility = 'public' | 'private'
```

Constants in `src/constants/` are safe to import from both server and client code.

---

## Schema Barrel Export

`src/api/schemas/index.ts` re-exports every schema file. External consumers always use the barrel.

**Inside schema files** — use direct relative imports to avoid circular dependencies:

```ts
// ✅ Correct (inside lists.schema.ts)
import { user } from './auth.schema'
import { listToTag } from './tags.schema'
```

**Outside schema files** — always use the barrel:

```ts
// ✅ Correct (in a repository, service, config, etc.)
import { list, listItem } from '@/api/schemas'

// ❌ Wrong — skips the barrel
import { list } from '@/api/schemas/lists.schema'
```

---

## Server / Client Boundary

| Directory        | Where it runs                                  | Rule                                                                              |
| ---------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/api/`       | Server only                                    | Must import `server-only` in entry-point files (`config/db.ts`, `config/auth.ts`) |
| `src/app/`       | Server (pages) or client (with `'use client'`) | Server Components can import from `src/api/` directly                             |
| `src/client/`    | Client only                                    | **Never** import from `src/api/`                                                  |
| `src/constants/` | Both                                           | Safe to use anywhere                                                              |

**Enforced by:** The `server-only` package throws a build-time error if a server module is accidentally bundled into the client.

```ts
// src/api/config/db.ts  ← always at the top
import 'server-only'
```
