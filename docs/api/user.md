# API — User

All user endpoints require authentication.

---

## GET /api/user/profile

Get the authenticated user's profile.

**Response:**

```json
{
  "profile": {
    "id": "...",
    "userId": "...",
    "displayName": "Harsha",
    "bio": "Building Listcy",
    "phone": null,
    "dateOfBirth": null,
    "timezone": "UTC",
    "locale": "en",
    "avatarUrl": "https://...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Profile is bootstrapped automatically on user creation via the auth hook — it always exists.

---

## PATCH /api/user/profile

Update the authenticated user's profile. Send only the fields you want to change.

**Updatable fields:**

| Field         | Type                   |
| ------------- | ---------------------- |
| `displayName` | string \| null         |
| `bio`         | string \| null         |
| `phone`       | string \| null         |
| `timezone`    | string (IANA timezone) |
| `locale`      | string (e.g. `"en"`)   |
| `avatarUrl`   | string \| null (URL)   |

**Body (partial):**

```json
{ "displayName": "Harsha", "bio": "Building Listcy" }
```

**Response:** `200 { "profile": { ... } }`

---

## GET /api/user/settings

Get the authenticated user's app settings.

**Response:**

```json
{
  "settings": {
    "id": "...",
    "userId": "...",
    "theme": "system",
    "locale": "en",
    "timezone": "UTC",
    "emailNotifications": true,
    "pushNotifications": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Settings are bootstrapped automatically on user creation.

---

## PATCH /api/user/settings

Update app settings. Send only the fields you want to change.

**Updatable fields:**

| Field                | Type                                | Default    |
| -------------------- | ----------------------------------- | ---------- |
| `theme`              | `"light"` \| `"dark"` \| `"system"` | `"system"` |
| `locale`             | string                              | `"en"`     |
| `timezone`           | string (IANA)                       | `"UTC"`    |
| `emailNotifications` | boolean                             | `true`     |
| `pushNotifications`  | boolean                             | `true`     |

**Body (partial):**

```json
{ "theme": "dark", "emailNotifications": false }
```

**Response:** `200 { "settings": { ... } }`
