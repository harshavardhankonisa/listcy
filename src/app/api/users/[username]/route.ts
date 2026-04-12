import type { UsernameContext } from '@/api/types'
import * as userController from '@/api/controllers/user.controller'

export async function GET(request: Request, { params }: UsernameContext) {
  const { username } = await params
  return userController.getPublicProfile(request, username)
}
