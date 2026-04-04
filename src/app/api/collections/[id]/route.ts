import * as collectionController from '@/api/controllers/collection.controller'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  const { id } = await params
  return collectionController.getCollection(request, id)
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  return collectionController.updateCollection(request, id)
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params
  return collectionController.deleteCollection(request, id)
}
