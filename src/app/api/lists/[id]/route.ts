import * as listController from '@/api/controllers/list.controller'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  const { id } = await params
  return listController.getList(request, id)
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  return listController.updateList(request, id)
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params
  return listController.deleteList(request, id)
}
