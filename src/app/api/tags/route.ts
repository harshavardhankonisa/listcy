import * as tagController from '@/api/controllers/tag.controller'

export async function GET() {
  return tagController.getTags()
}
