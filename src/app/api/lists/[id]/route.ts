import { NextResponse } from 'next/server'
import { requireSession } from '@/api/middlewares/auth.middleware'
import * as listService from '@/api/services/list.service'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  const { id } = await params

  let requesterId: string | null = null
  try {
    const { session } = await requireSession()
    requesterId = session?.user?.id ?? null
  } catch {
    // Unauthenticated — that's okay for public lists
  }

  const found = await listService.getListById(id, requesterId)
  if (!found) {
    return NextResponse.json({ error: 'List not found' }, { status: 404 })
  }

  return NextResponse.json({ list: found })
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const { session, error } = await requireSession()
  if (error) return error

  const body = await request.json()
  const allowed = ['title', 'description', 'coverImage', 'visibility'] as const

  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) data[key] = body[key]
  }

  const updated = await listService.updateList(id, session.user.id, data)
  if (!updated) {
    return NextResponse.json(
      { error: 'List not found or not owned' },
      { status: 404 }
    )
  }

  return NextResponse.json({ list: updated })
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params
  const { session, error } = await requireSession()
  if (error) return error

  const deleted = await listService.deleteList(id, session.user.id)
  if (!deleted) {
    return NextResponse.json(
      { error: 'List not found or not owned' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
