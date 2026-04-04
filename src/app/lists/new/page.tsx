import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/api/config/auth'
import { AppShell } from '@/client/components/layout/AppShell'
import { CreateListForm } from '@/client/lists/CreateListForm'

export const metadata = { title: 'Create a List' }

export default async function NewListPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/login')

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl py-6">
        <CreateListForm />
      </div>
    </AppShell>
  )
}
