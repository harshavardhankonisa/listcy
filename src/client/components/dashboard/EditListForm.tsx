'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { VISIBILITIES, LIST_TYPES } from '@/common/enums/list'
import type { ListType, Visibility } from '@/common/enums/list'

type Props = {
  slug: string
  initialData: {
    title: string
    description: string | null
    coverImage: string | null
    visibility: string
    type: string
    tags: { id: string; name: string }[]
  }
}

export function EditListForm({ slug, initialData }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData.title)
  const [description, setDescription] = useState(initialData.description ?? '')
  const [coverImage, setCoverImage] = useState(initialData.coverImage ?? '')
  const [visibility, setVisibility] = useState<Visibility>(
    initialData.visibility as Visibility
  )
  const [type, setType] = useState<ListType>(initialData.type as ListType)
  const [tags, setTags] = useState(
    initialData.tags.map((t) => t.name).join(', ')
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const resp = await fetch(`/api/lists/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          coverImage: coverImage.trim() || null,
          visibility,
          type,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })
      if (!resp.ok) throw new Error()
      const data = await resp.json()
      setSuccess(true)
      // If slug changed (title changed), redirect to new slug
      if (data.list?.slug && data.list.slug !== slug) {
        router.replace(`/dashboard/lists/${data.list.slug}/edit`)
      } else {
        router.refresh()
      }
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this list permanently?')) return
    const resp = await fetch(`/api/lists/${slug}`, { method: 'DELETE' })
    if (resp.ok) router.push('/dashboard/lists')
  }

  const inputClass =
    'h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:bg-zinc-900'

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={saving}
          className={inputClass.replace('h-10', 'py-2')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Cover Image URL
        </label>
        <input
          type="text"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          disabled={saving}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ListType)}
            disabled={saving}
            className={inputClass}
          >
            {LIST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
            disabled={saving}
            className={inputClass}
          >
            {VISIBILITIES.map((v) => (
              <option key={v} value={v}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={saving}
          placeholder="music, 2024, favourites"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Changes saved.
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
        >
          Delete List
        </button>
      </div>
    </form>
  )
}
