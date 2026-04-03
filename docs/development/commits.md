# Commit Convention

Listcy follows [Conventional Commits](https://www.conventionalcommits.org) with one project-specific addition: `setup:`.

## Format

```
<type>(<optional scope>): <short description>
```

- **type** — what kind of change (see table below)
- **scope** — optional, narrows the area e.g. `feat(lists):`, `fix(auth):`
- **description** — lowercase, present tense, no period at the end

---

## Types

| Type        | When to use                                                                          |
| ----------- | ------------------------------------------------------------------------------------ |
| `feat:`     | A new feature or capability                                                          |
| `fix:`      | A bug fix                                                                            |
| `setup:`    | Initial scaffolding, infrastructure, config, or tooling setup _(project convention)_ |
| `refactor:` | Code restructuring — not a fix, not a feature                                        |
| `docs:`     | Documentation changes only                                                           |
| `style:`    | Formatting, whitespace — no logic change                                             |
| `perf:`     | Performance improvement                                                              |
| `test:`     | Adding or fixing tests                                                               |
| `build:`    | Build system or dependency changes                                                   |
| `ci:`       | CI/CD config changes                                                                 |
| `chore:`    | Maintenance tasks that don't fit elsewhere                                           |
| `revert:`   | Reverts a previous commit                                                            |

---

## Scopes

Use scopes to narrow down what area of the codebase was changed:

```
feat(lists): add visibility toggle
fix(auth): handle expired session redirect
setup(db): add drizzle schema for collections
refactor(services): extract ownership check into helper
docs(api): document lists endpoints
```

---

## Breaking Changes

Add `!` after the type for breaking changes:

```
feat!: remove public list endpoint
refactor(auth)!: replace session cookies with JWT
```

---

## Examples from This Repo

These are real commits — the types and style used here are the standard to follow:

```
feat: add collection list tags tables api ui
feat: add user profile and settings api integration with ui
feat: add server-only package and fix flash when theme changes
feat: add constants global and add docs
fix: remove redundant code in theme provider
fix: format all files
setup: add users profile and settings schema
setup: add makefile for devxp and change listcy to listcy-main
setup: add docker local and prod setup with prettier drizzle and next-auth
setup: add next.js as base to project
```

---

## Common Scopes for Listcy

| Scope         | Use for                                           |
| ------------- | ------------------------------------------------- |
| `lists`       | List domain — routes, service, repository, schema |
| `collections` | Collections domain                                |
| `tags`        | Tags domain                                       |
| `auth`        | Authentication, session, Better Auth config       |
| `user`        | User profile and settings                         |
| `db`          | Database schema, migrations, Drizzle config       |
| `api`         | Route handlers in `src/app/api/`                  |
| `ui`          | Client components in `src/client/`                |
| `infra`       | Docker, Makefile, compose files                   |
