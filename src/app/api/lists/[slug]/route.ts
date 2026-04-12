import type { SlugContext } from '@/api/types'
import * as listController from '@/api/controllers/list.controller'

export async function GET(request: Request, { params }: SlugContext) {
  const { slug } = await params
  return listController.getListBySlug(request, slug)
}

export async function PATCH(request: Request, { params }: SlugContext) {
  const { slug } = await params
  return listController.updateListBySlug(request, slug)
}

export async function DELETE(request: Request, { params }: SlugContext) {
  const { slug } = await params
  return listController.deleteListBySlug(request, slug)
}
