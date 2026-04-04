import * as collectionController from '@/api/controllers/collection.controller'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  return collectionController.addListToCollection(request, id)
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params
  return collectionController.removeListFromCollection(request, id)
}
