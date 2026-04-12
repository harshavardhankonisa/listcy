import type { SlugContext } from '@/api/types'
import * as listController from '@/api/controllers/list.controller'

export async function POST(request: Request, { params }: SlugContext) {
  const { slug } = await params
  return listController.addItemBySlug(request, slug)
}
