import 'server-only'

import * as listRepo from '@/api/repositories/list.repository'

export async function getStats(userId: string) {
  const [lists, publicLists] = await Promise.all([
    listRepo.findByUserId(userId),
    listRepo.countPublicByUserId(userId),
  ])
  const totalLists = lists.length
  const totalItems = lists.reduce((sum, l) => sum + (l.content?.length ?? 0), 0)
  return {
    totalLists,
    publicLists,
    privateLists: totalLists - publicLists,
    totalItems,
  }
}
