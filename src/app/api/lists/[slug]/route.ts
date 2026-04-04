import * as listController from '@/api/controllers/list.controller'

type Params = { params: Promise<{ slug: string }> }

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params
  return listController.getListBySlug(request, slug)
}

export async function PATCH(request: Request, { params }: Params) {
  const { slug } = await params
  return listController.updateListBySlug(request, slug)
}

export async function DELETE(request: Request, { params }: Params) {
  const { slug } = await params
  return listController.deleteListBySlug(request, slug)
}
