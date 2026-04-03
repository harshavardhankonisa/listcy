# Security Rules

These are non-negotiable. Every new feature must comply with all of them.

---

## 1. Server-Only Guard

Every `src/api/` entry-point file must have this as its **first import**:

```ts
import 'server-only'
```

Currently applied to: `src/api/config/db.ts`, `src/api/config/auth.ts`

This causes a build-time error if the module is accidentally imported in client code, preventing secrets from leaking into the browser bundle.

---

## 2. No Secret Defaults

Environment variables that contain secrets must **never** have fallback values in code.

```ts
// ✅ Correct
const secret = process.env.BETTER_AUTH_SECRET

// ❌ Wrong — leaks a default into the build
const secret = process.env.BETTER_AUTH_SECRET ?? 'dev-secret'
```

If the variable is missing, the app should fail loudly, not silently fall back.

---

## 3. SSL on Production Database

Production database connections must use proper SSL.

```ts
// ❌ Never do this in production
ssl: {
  rejectUnauthorized: false
}
```

Use a valid certificate or the provider's SSL mode.

---

## 4. Input Validation on All Route Handlers

Every route handler that accepts a request body must validate it before processing.

Currently: manual field checks on required fields (`title`, `listId`).
Direction: migrate to Zod schemas in `src/api/validators/`.

```ts
// Minimum — already in place
if (!body.title || typeof body.title !== 'string') {
  return NextResponse.json({ error: 'Title is required' }, { status: 400 })
}
```

---

## 5. Rate Limiting

Apply rate limiting to:

- All auth endpoints (`/api/auth/...`)
- All write operations (POST, PATCH, DELETE)

Rate limiting middleware lives in `src/api/middlewares/ratelimit.middleware.ts`.

---

## 6. Ownership Checks in the Service Layer

All mutation operations must verify the requesting user owns the resource **in the service layer**, not in the route handler.

```ts
// list.service.ts
export async function deleteList(id: string, userId: string) {
  return listRepo.remove(id, userId) // ← repo checks userId match
}
```

If the resource is not found or not owned, return `null` from the service. The route handler maps `null` → `404`.

**Never** trust the client to send a valid `userId`. Always derive it from `session.user.id`.
