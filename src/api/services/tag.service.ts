import * as tagRepo from '@/api/repositories/tag.repository'

export async function getAllTags() {
  return tagRepo.findAll()
}

export async function getTagBySlug(slug: string) {
  return tagRepo.findBySlug(slug)
}

export async function findOrCreateTag(name: string) {
  return tagRepo.findOrCreate(name)
}

export async function deleteTag(id: string) {
  return tagRepo.remove(id)
}
