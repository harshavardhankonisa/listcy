import 'server-only'

import * as listRepo from '@/api/repositories/list.repository'

export async function getStats(userId: string) {
  const [totalLists, publicLists, totalItems] = await Promise.all([
    listRepo.countByUserId(userId),
    listRepo.countPublicByUserId(userId),
    listRepo.countItemsByUserId(userId),
  ])
  return {
    totalLists,
    publicLists,
    privateLists: totalLists - publicLists,
    totalItems,
  }
}
