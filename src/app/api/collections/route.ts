import { NextResponse } from 'next/server'
import { requireSession } from '@/api/middlewares/auth.middleware'
import * as collectionService from '@/api/services/collection.service'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const isPublic = url.searchParams.get('public') === 'true'

  if (isPublic) {
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 50)
    const offset = Number(url.searchParams.get('offset') ?? 0)
    const collections = await collectionService.getPublicCollections(
      limit,
      offset
    )
    return NextResponse.json({ collections })
  }

  const { session, error } = await requireSession()
  if (error) return error

  const collections = await collectionService.getCollectionsByUserId(
    session.user.id
  )
  return NextResponse.json({ collections })
}

export async function POST(request: Request) {
  const { session, error } = await requireSession()
  if (error) return error

  const body = await request.json()

  if (!body.title || typeof body.title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  const created = await collectionService.createCollection(session.user.id, {
    title: body.title,
    description: body.description ?? null,
    coverImage: body.coverImage ?? null,
    visibility: body.visibility ?? 'public',
    tags: body.tags ?? [],
  })

  return NextResponse.json({ collection: created }, { status: 201 })
}
