import * as listController from '@/api/controllers/list.controller'

export async function GET() {
  return listController.getDashboardStats()
}
