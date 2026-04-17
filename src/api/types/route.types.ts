import 'server-only'

import type { NextResponse } from 'next/server'

/**
 * Shared route handler types.
 *
 * Route param contexts are used by both route handlers (src/app/api/)
 * and referenced in controllers (src/api/controllers/).
 *
 */

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

// Controller Response

export type ApiResponse = Promise<NextResponse>
