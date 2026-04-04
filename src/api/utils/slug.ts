import 'server-only'

/**
 * Generate a URL-safe slug from a string.
 * "My Top 10 Books 2024!" → "my-top-10-books-2024"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, '') // Trim leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a numeric suffix if the base slug exists.
 * Uses the `exists` callback to check the database.
 */
export async function generateUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const slug = slugify(base)
  if (!slug) return crypto.randomUUID().slice(0, 8)

  if (!(await exists(slug))) return slug

  // Try suffixed versions: slug-2, slug-3, ...
  for (let i = 2; i <= 100; i++) {
    const candidate = `${slug}-${i}`
    if (!(await exists(candidate))) return candidate
  }

  // Extremely unlikely — fallback to random suffix
  return `${slug}-${crypto.randomUUID().slice(0, 6)}`
}

/**
 * Generate a unique username from a name or email.
 */
export function usernameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'user'
  return slugify(local)
}
