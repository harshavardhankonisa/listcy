import * as dashboardController from '@/api/controllers/dashboard.controller'

export async function GET() {
  return dashboardController.getStats()
}
