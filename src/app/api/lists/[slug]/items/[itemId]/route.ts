import type { SlugItemContext } from '@/api/types'
import * as listController from '@/api/controllers/list.controller'

export async function PATCH(request: Request, { params }: SlugItemContext) {
  const { slug, itemId } = await params
  return listController.updateItem(request, slug, itemId)
}

export async function DELETE(request: Request, { params }: SlugItemContext) {
  const { slug, itemId } = await params
  return listController.deleteItem(request, slug, itemId)
}
