'use client'

import { useState } from 'react'

const categories = [
  'All',
  'Lists',
  'Music',
  'Movies',
  'Books',
  'Travel',
  'Food',
  'Gaming',
  'Tech',
  'Sports',
  'Fashion',
  'Science',
  'Recently added',
]

export function CategoryChips() {
  const [active, setActive] = useState('All')

  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-3">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            active === cat
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
