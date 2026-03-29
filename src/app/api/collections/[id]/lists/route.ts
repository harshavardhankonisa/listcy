import { NextResponse } from 'next/server'
import { requireSession } from '@/api/middlewares/auth.middleware'
import * as collectionService from '@/api/services/collection.service'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const { session, error } = await requireSession()
  if (error) return error

  const body = await request.json()

  if (!body.listId || typeof body.listId !== 'string') {
    return NextResponse.json({ error: 'listId is required' }, { status: 400 })
  }

  const result = await collectionService.addListToCollection(
    id,
    session.user.id,
    body.listId,
    body.position ?? 0
  )

  if (!result) {
    return NextResponse.json(
      { error: 'Collection or list not found, or not authorized' },
      { status: 404 }
    )
  }

  return NextResponse.json({ result }, { status: 201 })
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params
  const { session, error } = await requireSession()
  if (error) return error

  const body = await request.json()

  if (!body.listId || typeof body.listId !== 'string') {
    return NextResponse.json({ error: 'listId is required' }, { status: 400 })
  }

  const result = await collectionService.removeListFromCollection(
    id,
    session.user.id,
    body.listId
  )

  if (!result) {
    return NextResponse.json(
      { error: 'Collection or list not found, or not authorized' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
