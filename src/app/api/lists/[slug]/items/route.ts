import * as listController from '@/api/controllers/list.controller'

type Params = { params: Promise<{ slug: string }> }

export async function POST(request: Request, { params }: Params) {
  const { slug } = await params
  return listController.addItemBySlug(request, slug)
}
