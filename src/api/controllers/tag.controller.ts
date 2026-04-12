import 'server-only'

import * as tagService from '@/api/services/tag.service'
import * as res from '@/api/utils/response'
import type { ApiResponse } from '@/api/types'

// Tags are public — no auth or rate limiting required.
// External rate limiting is handled by Cloudflare.

export async function getTags(): ApiResponse {
  const tags = await tagService.getAllTags()
  return res.ok({ tags })
}
