import * as userController from '@/api/controllers/user.controller'

export async function GET() {
  return userController.getSettings()
}

export async function PATCH(request: Request) {
  return userController.updateSettings(request)
}
