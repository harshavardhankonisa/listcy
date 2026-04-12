import type { SlugItemContext } from '@/api/types'
import * as listController from '@/api/controllers/list.controller'

export async function PATCH(request: Request, { params }: SlugItemContext) {
  const { itemId } = await params
  return listController.updateItem(request, itemId)
}

export async function DELETE(request: Request, { params }: SlugItemContext) {
  const { itemId } = await params
  return listController.deleteItem(request, itemId)
}
