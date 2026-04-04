import * as listController from '@/api/controllers/list.controller'

type Params = { params: Promise<{ slug: string; itemId: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const { itemId } = await params
  return listController.updateItem(request, itemId)
}

export async function DELETE(request: Request, { params }: Params) {
  const { itemId } = await params
  return listController.deleteItem(request, itemId)
}
