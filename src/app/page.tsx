import { AppShell } from '@/client/components/layout/AppShell'
import { CategoryChips } from '@/client/components/common/CategoryChips'
import { ListCard } from '@/client/components/common/ListCard'

const sampleLists = [
  {
    title: 'Top 10 Sci-Fi Movies You Must Watch',
    author: 'CinemaFan',
    itemCount: 10,
    category: 'Movies',
    timeAgo: '2 days ago',
  },
  {
    title: 'Best Coffee Shops in London',
    author: 'UrbanExplorer',
    itemCount: 15,
    category: 'Travel',
    timeAgo: '5 hours ago',
  },
  {
    title: 'Essential Albums of the 2020s',
    author: 'MusicNerd',
    itemCount: 25,
    category: 'Music',
    timeAgo: '1 week ago',
  },
  {
    title: 'Must-Read Fantasy Book Series',
    author: 'BookWorm42',
    itemCount: 12,
    category: 'Books',
    timeAgo: '3 days ago',
  },
  {
    title: 'Hidden Gem Restaurants in Tokyo',
    author: 'FoodieJapan',
    itemCount: 20,
    category: 'Food',
    timeAgo: '12 hours ago',
  },
  {
    title: 'Best Indie Games of All Time',
    author: 'PixelQuest',
    itemCount: 30,
    category: 'Gaming',
    timeAgo: '4 days ago',
  },
  {
    title: 'Top Tech Podcasts for Developers',
    author: 'DevDaily',
    itemCount: 8,
    category: 'Tech',
    timeAgo: '1 day ago',
  },
  {
    title: 'Weekend Hiking Trails Near Sydney',
    author: 'TrailBlazer',
    itemCount: 14,
    category: 'Travel',
    timeAgo: '6 hours ago',
  },
  {
    title: 'Classic Rock Anthems Playlist',
    author: 'RockLegend',
    itemCount: 50,
    category: 'Music',
    timeAgo: '2 weeks ago',
  },
  {
    title: 'Best Street Food Around the World',
    author: 'NomadEats',
    itemCount: 18,
    category: 'Food',
    timeAgo: '3 hours ago',
  },
  {
    title: 'Award-Winning Documentaries 2025',
    author: 'DocWatch',
    itemCount: 10,
    category: 'Movies',
    timeAgo: '1 day ago',
  },
  {
    title: 'Beginner-Friendly Science Books',
    author: 'SciCurious',
    itemCount: 9,
    category: 'Science',
    timeAgo: '5 days ago',
  },
]

export default function Home() {
  return (
    <AppShell>
      <CategoryChips />
      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sampleLists.map((list, index) => (
          <ListCard key={`${list.title}-${index}`} {...list} />
        ))}
      </div>
    </AppShell>
  )
}
