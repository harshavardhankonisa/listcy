import * as listController from '@/api/controllers/list.controller'

export async function GET(request: Request) {
  return listController.getLists(request)
}

export async function POST(request: Request) {
  return listController.createList(request)
}
