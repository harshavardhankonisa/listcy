# API — Lists

Base path: `/api/lists`

---

## GET /api/lists

Returns lists. Behavior depends on auth state and query params.

**Public feed (no auth required):**

```
GET /api/lists?public=true&limit=20&offset=0
```

| Param    | Type     | Default | Max  |
| -------- | -------- | ------- | ---- |
| `public` | `"true"` | —       | —    |
| `limit`  | number   | `20`    | `50` |
| `offset` | number   | `0`     | —    |

**Response:**

```json
{ "lists": [ { "id": "...", "title": "...", "visibility": "public", ... } ] }
```

**Authenticated user's own lists:**

```
GET /api/lists
Authorization: session cookie
```

Returns all lists belonging to the authenticated user (any visibility).

---

## POST /api/lists

Create a new list. Requires auth.

**Body:**

```json
{
  "title": "My List",
  "description": "Optional description",
  "coverImage": "https://...",
  "visibility": "public",
  "tags": ["music", "2024"]
}
```

| Field         | Required | Type                      | Notes                           |
| ------------- | -------- | ------------------------- | ------------------------------- |
| `title`       | ✅       | string                    |                                 |
| `description` | —        | string \| null            |                                 |
| `coverImage`  | —        | string \| null            | URL                             |
| `visibility`  | —        | `"public"` \| `"private"` | Default: `"public"`             |
| `tags`        | —        | string[]                  | Tag names — auto created if new |

**Response:** `201`

```json
{ "list": { "id": "...", "title": "...", ... } }
```

---

## GET /api/lists/[id]

Get a single list with its items and tags.

- Public lists: no auth required
- Private lists: only the owner can view (returns `404` for others)

**Response:**

```json
{
  "list": {
    "id": "...",
    "title": "...",
    "visibility": "public",
    "items": [ { "id": "...", "title": "...", "position": 0, ... } ],
    "tags": [ { "id": "...", "name": "music", "slug": "music" } ]
  }
}
```

**Errors:** `404` if not found or not accessible.

---

## PATCH /api/lists/[id]

Update a list. Owner only.

**Updatable fields:** `title`, `description`, `coverImage`, `visibility`

**Body (partial):**

```json
{ "title": "Updated title", "visibility": "private" }
```

**Response:** `200` with updated list. `404` if not found or not owned.

---

## DELETE /api/lists/[id]

Delete a list. Owner only. Cascades to items and tag associations.

**Response:** `200 { "success": true }`. `404` if not found or not owned.

---

## POST /api/lists/[id]/items

Add an item to a list. Owner only.

**Body:**

```json
{
  "title": "Item title",
  "description": "Optional",
  "url": "https://...",
  "imageUrl": "https://...",
  "position": 0
}
```

| Field         | Required | Type                 |
| ------------- | -------- | -------------------- |
| `title`       | ✅       | string               |
| `description` | —        | string \| null       |
| `url`         | —        | string \| null       |
| `imageUrl`    | —        | string \| null       |
| `position`    | —        | number (default `0`) |

**Response:** `201 { "item": { ... } }`. `404` if list not found or not owned.
