import 'server-only'

import type { NextResponse } from 'next/server'

/**
 * Shared route handler types.
 *
 * Route param contexts are used by both route handlers (src/app/api/)
 * and referenced in controllers (src/api/controllers/).
 *
 * Keep types flat and serialisation-friendly for future Rust migration.
 */

// ── Route Param Contexts ─────────────────────────────────────────────────────
// Next.js App Router passes params as a Promise in route handlers.

/** /lists/[slug] */
export type SlugContext = { params: Promise<{ slug: string }> }

/** /lists/[slug]/items/[itemId] */
export type SlugItemContext = {
  params: Promise<{ slug: string; itemId: string }>
}

/** /collections/[id] */
export type IdContext = { params: Promise<{ id: string }> }

/** /users/[username] */
export type UsernameContext = { params: Promise<{ username: string }> }

// ── Controller Response ──────────────────────────────────────────────────────
// Explicit return type for all controller functions.

export type ApiResponse = Promise<NextResponse>
