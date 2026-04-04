import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/api/config/auth'
import * as listService from '@/api/services/list.service'
import { EditListForm } from '@/client/components/dashboard/EditListForm'
import { ItemsManager } from '@/client/components/dashboard/ItemsManager'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const list = await listService.getListBySlug(slug)
  return { title: list ? `Edit: ${list.title}` : 'Edit List' }
}

export default async function EditListPage({ params }: Props) {
  const { slug } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const list = await listService.getListBySlug(slug, session.user.id)
  if (!list || list.userId !== session.user.id) notFound()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Edit List
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href={`/lists/${list.slug}`}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              View public page →
            </Link>
          </p>
        </div>
      </div>

      {/* Edit form */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <EditListForm
          slug={slug}
          initialData={{
            title: list.title,
            description: list.description,
            coverImage: list.coverImage,
            visibility: list.visibility,
            type: list.type,
            tags: list.tags,
          }}
        />
      </div>

      {/* Items manager */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <ItemsManager slug={slug} items={list.items} />
      </div>
    </div>
  )
}
