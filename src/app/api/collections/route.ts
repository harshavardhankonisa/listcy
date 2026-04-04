import * as collectionController from '@/api/controllers/collection.controller'

export async function GET(request: Request) {
  return collectionController.getCollections(request)
}

export async function POST(request: Request) {
  return collectionController.createCollection(request)
}
