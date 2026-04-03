# API — Tags

Base path: `/api/tags`

Tags are global — they are shared across lists and collections. They are created automatically when assigned to a list or collection by name.

---

## GET /api/tags

Returns all tags. No auth required.

**Response:**

```json
{
  "tags": [
    { "id": "...", "name": "music", "slug": "music", "createdAt": "..." },
    { "id": "...", "name": "2024", "slug": "2024", "createdAt": "..." }
  ]
}
```

---

## Tag Creation

Tags are **not** created via a dedicated POST endpoint. They are auto-created (find-or-create) when you assign tag names to a list or collection:

```json
// POST /api/lists  or  POST /api/collections
{ "title": "My List", "tags": ["music", "new-tag-auto-created"] }
```

Each tag name is slugified and stored with a unique `slug`. If a tag with that name already exists, it is reused.
