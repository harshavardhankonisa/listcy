'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Item = {
  id: string
  title: string
  description: string | null
  url: string | null
  imageUrl: string | null
  position: number
}

export function ItemsManager({ slug, items }: { slug: string; items: Item[] }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const inputClass =
    'h-9 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:bg-zinc-900'

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setAdding(true)
    try {
      const resp = await fetch(`/api/lists/${slug}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          url: url.trim() || null,
          position: items.length,
        }),
      })
      if (resp.ok) {
        setTitle('')
        setDescription('')
        setUrl('')
        router.refresh()
      }
    } finally {
      setAdding(false)
    }
  }

  async function handleDeleteItem(itemId: string) {
    setDeletingId(itemId)
    try {
      const resp = await fetch(`/api/lists/${slug}/items/${itemId}`, {
        method: 'DELETE',
      })
      if (resp.ok) router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Items ({items.length})
      </h3>

      {/* Existing items */}
      {items.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </p>
                {item.description && (
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                )}
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  🔗
                </a>
              )}
              <button
                onClick={() => handleDeleteItem(item.id)}
                disabled={deletingId === item.id}
                className="shrink-0 text-xs font-medium text-red-500 hover:text-red-400 disabled:opacity-50"
              >
                {deletingId === item.id ? '...' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add item form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700"
      >
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Add new item
        </p>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Item title"
          disabled={adding}
          className={inputClass}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          disabled={adding}
          className={inputClass}
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (optional)"
          disabled={adding}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={adding || !title.trim()}
          className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {adding ? 'Adding…' : '+ Add Item'}
        </button>
      </form>
    </div>
  )
}
