import type { IdContext } from '@/api/types'
import * as collectionController from '@/api/controllers/collection.controller'

export async function GET(request: Request, { params }: IdContext) {
  const { id } = await params
  return collectionController.getCollection(request, id)
}

export async function PATCH(request: Request, { params }: IdContext) {
  const { id } = await params
  return collectionController.updateCollection(request, id)
}

export async function DELETE(request: Request, { params }: IdContext) {
  const { id } = await params
  return collectionController.deleteCollection(request, id)
}
