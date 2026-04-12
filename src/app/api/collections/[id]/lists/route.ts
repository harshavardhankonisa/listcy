import type { IdContext } from '@/api/types'
import * as collectionController from '@/api/controllers/collection.controller'

export async function POST(request: Request, { params }: IdContext) {
  const { id } = await params
  return collectionController.addListToCollection(request, id)
}

export async function DELETE(request: Request, { params }: IdContext) {
  const { id } = await params
  return collectionController.removeListFromCollection(request, id)
}
