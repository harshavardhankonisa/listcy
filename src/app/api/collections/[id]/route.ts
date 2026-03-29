import { NextResponse } from 'next/server'
import { requireSession } from '@/api/middlewares/auth.middleware'
import * as collectionService from '@/api/services/collection.service'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  const { id } = await params

  let requesterId: string | null = null
  try {
    const { session } = await requireSession()
    requesterId = session?.user?.id ?? null
  } catch {
    // Unauthenticated
  }

  const found = await collectionService.getCollectionById(id, requesterId)
  if (!found) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  return NextResponse.json({ collection: found })
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

  const updated = await collectionService.updateCollection(
    id,
    session.user.id,
    data
  )
  if (!updated) {
    return NextResponse.json(
      { error: 'Collection not found or not owned' },
      { status: 404 }
    )
  }

  return NextResponse.json({ collection: updated })
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params
  const { session, error } = await requireSession()
  if (error) return error

  const deleted = await collectionService.deleteCollection(id, session.user.id)
  if (!deleted) {
    return NextResponse.json(
      { error: 'Collection not found or not owned' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
