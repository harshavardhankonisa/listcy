import * as userController from '@/api/controllers/user.controller'

type Params = { params: Promise<{ username: string }> }

export async function GET(request: Request, { params }: Params) {
  const { username } = await params
  return userController.getPublicProfile(request, username)
}
