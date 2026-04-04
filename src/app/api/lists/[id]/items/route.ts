import * as listController from '@/api/controllers/list.controller'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  return listController.addItem(request, id)
}
