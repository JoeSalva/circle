/**
 * Connections screen (/connections) — followers & following lists.
 *
 * BACKEND mapping (stubs in lib/api.ts):
 *   listFollowers() -> GET /user/me/followers/?page=  (UserSerializer)
 *   listFollowing() -> GET /user/me/following/?page=  (UserSerializer)
 *   toggleFollow()  -> POST /follow/user/<id>         (unfollow action)
 *
 * Both list endpoints also accept a ?username= filter via UserFilter
 * (django-filter) — the search box below can pass that straight through.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserMinus } from 'lucide-react'
import Avatar from '../components/Avatar'
import { mockFollowers, mockFollowing, type PersonCard } from '../data/mock'

type Tab = 'followers' | 'following'

export default function Connections() {
  const [tab, setTab] = useState<Tab>('followers')
  const [query, setQuery] = useState('')
  // BACKEND: useEffect -> tab === 'followers' ? listFollowers() : listFollowing()
  const [followers] = useState(mockFollowers)
  const [following, setFollowing] = useState(mockFollowing)

  const source = tab === 'followers' ? followers : following
  const visible = source.filter((u) => u.username.toLowerCase().includes(query.toLowerCase()))

  const unfollow = (userId: number) => {
    // BACKEND: POST /follow/user/<id> toggle — optimistic removal.
    setFollowing((fs) => fs.filter((u) => u.id !== userId))
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Top bar — same chrome as the profile screen */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
          <Link to="/" className="font-display text-2xl font-bold italic text-gather">
            Gather
          </Link>
          <nav className="flex gap-6 text-[15px]">
            <Link to="/" className="font-medium text-ink-soft transition hover:text-ink">Home</Link>
            <Link to="/explore" className="font-medium text-ink-soft transition hover:text-ink">Explore</Link>
            <Link to="/connections" className="font-medium text-gather">Communities</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display text-4xl font-bold text-ink">Your Circle</h1>
        <p className="mt-2 text-[15px] text-ink-soft">The people you share warmth with.</p>

        {/* Tabs */}
        <div className="mt-8 flex gap-10 border-b border-hairline">
          {(
            [
              ['followers', `Followers (${followers.length})`],
              ['following', `Following (${following.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`-mb-px border-b-2 px-1 pb-3 text-[15px] transition ${
                tab === key ? 'border-gather font-semibold text-gather' : 'border-transparent font-medium text-ink-soft hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search -> BACKEND: ?username= filter supported by UserFilter */}
        <label className="mt-6 flex h-11 items-center gap-2 rounded-full border border-hairline bg-white px-4 text-sm text-ink-soft shadow-sm">
          <Search size={16} className="text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username..."
            className="w-full bg-transparent outline-none placeholder:text-ink-faint"
          />
        </label>

        <ul className="mt-6 space-y-3">
          {visible.map((u: PersonCard) => (
            <li key={u.id} className="card flex items-center gap-4 p-4">
              <Avatar name={u.username} size={48} userId={u.id} to={`/profile/${u.id}`} />
              <div className="min-w-0">
                <Link to={`/profile/${u.id}`} className="block truncate text-[15px] font-semibold text-ink transition hover:text-gather">
                  {u.username}
                </Link>
                {u.description && <p className="truncate text-sm text-ink-soft">{u.description}</p>}
              </div>
              {tab === 'following' && (
                <button
                  type="button"
                  onClick={() => unfollow(u.id)}
                  className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-white px-4 text-xs font-medium text-ink-soft transition hover:border-red-200 hover:text-red-500"
                >
                  <UserMinus size={14} /> Unfollow
                </button>
              )}
            </li>
          ))}
          {visible.length === 0 && (
            <li className="card p-10 text-center text-ink-soft">
              {tab === 'followers' ? 'No followers yet — share some warmth!' : "You're not following anyone yet."}
            </li>
          )}
        </ul>
      </main>
    </div>
  )
}
