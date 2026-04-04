import * as userController from '@/api/controllers/user.controller'

export async function GET() {
  return userController.getProfile()
}

export async function PATCH(request: Request) {
  return userController.updateProfile(request)
}
