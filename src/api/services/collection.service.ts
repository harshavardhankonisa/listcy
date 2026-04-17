import 'server-only'

import * as collectionRepo from '@/api/repositories/collection.repository'
import * as listRepo from '@/api/repositories/list.repository'
import * as tagRepo from '@/api/repositories/tag.repository'
import type { Visibility } from '@/common/constants/list'

export async function getCollectionById(
  id: string,
  requesterId?: string | null
) {
  const found = await collectionRepo.findById(id)
  if (!found) return null

  if (found.visibility === 'private' && found.userId !== requesterId) {
    return null
  }

  const listJunctions = await collectionRepo.findListsByCollectionId(id)
  const lists =
    listJunctions.length > 0
      ? await Promise.all(listJunctions.map((j) => listRepo.findById(j.listId)))
      : []

  return { ...found, lists: lists.filter(Boolean) }
}

export async function getCollectionsByUserId(userId: string) {
  return collectionRepo.findByUserId(userId)
}

export async function getPublicCollectionsByUserId(
  userId: string,
  limit = 20,
  offset = 0
) {
  return collectionRepo.findPublicByUserId(userId, limit, offset)
}

export async function getPublicCollections(limit = 20, offset = 0) {
  return collectionRepo.findPublic(limit, offset)
}

export async function createCollection(
  userId: string,
  data: {
    title: string
    description?: string | null
    coverImage?: string | null
    visibility?: Visibility
    tags?: string[]
  }
) {
  const { tags: tagNames, ...collectionData } = data
  const created = await collectionRepo.create({ userId, ...collectionData })

  if (tagNames && tagNames.length > 0) {
    const resolvedTags = await Promise.all(
      tagNames.map((n) => tagRepo.findOrCreate(n))
    )
    await collectionRepo.setTags(
      created.id,
      resolvedTags.map((t) => t.id)
    )
  }

  return created
}

export async function updateCollection(
  id: string,
  userId: string,
  data: Partial<{
    title: string
    description: string | null
    coverImage: string | null
    visibility: Visibility
  }>
) {
  return collectionRepo.update(id, userId, data)
}

export async function deleteCollection(id: string, userId: string) {
  return collectionRepo.remove(id, userId)
}

export async function addListToCollection(
  collectionId: string,
  userId: string,
  listId: string,
  position = 0
) {
  const found = await collectionRepo.findById(collectionId)
  if (!found || found.userId !== userId) return null

  const listFound = await listRepo.findById(listId)
  if (!listFound) return null
  if (listFound.visibility === 'private' && listFound.userId !== userId)
    return null

  return collectionRepo.addList(collectionId, listId, position)
}

export async function removeListFromCollection(
  collectionId: string,
  userId: string,
  listId: string
) {
  const found = await collectionRepo.findById(collectionId)
  if (!found || found.userId !== userId) return null

  return collectionRepo.removeList(collectionId, listId)
}

export async function setCollectionTags(
  collectionId: string,
  userId: string,
  tagNames: string[]
) {
  const found = await collectionRepo.findById(collectionId)
  if (!found || found.userId !== userId) return null

  const resolvedTags = await Promise.all(
    tagNames.map((n) => tagRepo.findOrCreate(n))
  )
  return collectionRepo.setTags(
    collectionId,
    resolvedTags.map((t) => t.id)
  )
}
