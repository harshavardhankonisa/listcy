import * as tagController from '@/api/controllers/tag.controller'

export async function GET(request: Request) {
  return tagController.getTags(request)
}
