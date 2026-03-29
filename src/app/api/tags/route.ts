import { NextResponse } from 'next/server'
import * as tagService from '@/api/services/tag.service'

export async function GET() {
  const tags = await tagService.getAllTags()
  return NextResponse.json({ tags })
}
