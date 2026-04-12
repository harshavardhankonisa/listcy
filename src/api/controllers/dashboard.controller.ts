import 'server-only'

import { requireSession } from '@/api/middlewares/auth.middleware'
import * as dashboardService from '@/api/services/dashboard.service'
import * as res from '@/api/utils/response'
import type { ApiResponse } from '@/api/types'

export async function getStats(): ApiResponse {
  const { session, error } = await requireSession()
  if (error) return error

  const stats = await dashboardService.getStats(session.user.id)
  return res.ok({ stats })
}
