# API — Collections

Base path: `/api/collections`

---

## GET /api/collections

**Public feed (no auth required):**

```
GET /api/collections?public=true&limit=20&offset=0
```

| Param    | Type     | Default | Max  |
| -------- | -------- | ------- | ---- |
| `public` | `"true"` | —       | —    |
| `limit`  | number   | `20`    | `50` |
| `offset` | number   | `0`     | —    |

**Authenticated user's own collections:**

```
GET /api/collections
Authorization: session cookie
```

**Response:**

```json
{ "collections": [ { "id": "...", "title": "...", "visibility": "public", ... } ] }
```

---

## POST /api/collections

Create a new collection. Requires auth.

**Body:**

```json
{
  "title": "My Collection",
  "description": "Optional",
  "coverImage": "https://...",
  "visibility": "public",
  "tags": ["favourites"]
}
```

| Field         | Required | Type                      | Notes               |
| ------------- | -------- | ------------------------- | ------------------- |
| `title`       | ✅       | string                    |                     |
| `description` | —        | string \| null            |                     |
| `coverImage`  | —        | string \| null            | URL                 |
| `visibility`  | —        | `"public"` \| `"private"` | Default: `"public"` |
| `tags`        | —        | string[]                  | Auto created if new |

**Response:** `201 { "collection": { ... } }`

---

## GET /api/collections/[id]

Get a single collection.

- Public collections: no auth required
- Private collections: owner only — returns `404` for others

**Response:**

```json
{ "collection": { "id": "...", "title": "...", "visibility": "public", ... } }
```

---

## PATCH /api/collections/[id]

Update a collection. Owner only.

**Updatable fields:** `title`, `description`, `coverImage`, `visibility`

**Response:** `200` with updated collection. `404` if not found or not owned.

---

## DELETE /api/collections/[id]

Delete a collection. Owner only. Does **not** delete the lists inside — only removes the collection and its associations.

**Response:** `200 { "success": true }`. `404` if not found or not owned.

---

## POST /api/collections/[id]/lists

Add a list to a collection. Requires auth and ownership of the collection.

**Body:**

```json
{ "listId": "list-id-here", "position": 0 }
```

| Field      | Required | Type                 |
| ---------- | -------- | -------------------- |
| `listId`   | ✅       | string               |
| `position` | —        | number (default `0`) |

**Response:** `201 { "result": { ... } }`. `404` if collection/list not found or not authorized.

---

## DELETE /api/collections/[id]/lists

Remove a list from a collection. Owner only.

**Body:**

```json
{ "listId": "list-id-here" }
```

**Response:** `200 { "success": true }`. `404` if not found or not authorized.
