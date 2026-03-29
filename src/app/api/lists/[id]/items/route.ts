import { NextResponse } from 'next/server'
import { requireSession } from '@/api/middlewares/auth.middleware'
import * as listService from '@/api/services/list.service'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const { session, error } = await requireSession()
  if (error) return error

  const body = await request.json()

  if (!body.title || typeof body.title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const item = await listService.addItem(id, session.user.id, {
    title: body.title,
    description: body.description ?? null,
    url: body.url ?? null,
    imageUrl: body.imageUrl ?? null,
    position: body.position ?? 0,
  })

  if (!item) {
    return NextResponse.json(
      { error: 'List not found or not owned' },
      { status: 404 }
    )
  }

  return NextResponse.json({ item }, { status: 201 })
}
