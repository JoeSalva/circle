/**
 * Explore screen (/explore) — people discovery.
 *
 * BACKEND mapping (stubs in lib/api.ts):
 *   listProfiles()  -> GET /users/profile/?page=
 *                      UserProfileSerializer: username, desc, location,
 *                      total_posts, followers, following, user_follows,
 *                      follows_user (excludes the current user)
 *   toggleFollow()  -> POST /follow/user/<id>
 *
 * The search field filters locally; when wired it should pass ?search=
 * (SearchFilter is not enabled on that view yet — note for backend work).
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search, UserCheck, UserPlus } from 'lucide-react'
import Avatar, { avatarGradientFor } from '../components/Avatar'
import { mockPeople } from '../data/mock'

export default function Explore() {
  const [people, setPeople] = useState(mockPeople)
  const [query, setQuery] = useState('')

  // BACKEND: replace with useEffect -> listProfiles() (GET /users/profile/).
  const visible = people.filter((p) => `${p.username} ${p.desc ?? ''}`.toLowerCase().includes(query.toLowerCase()))

  const follow = (userId: number) => {
    // BACKEND: POST /follow/user/<id> — optimistic toggle of user_follows.
    setPeople((ps) => ps.map((p) => (p.id === userId ? { ...p, user_follows: !p.user_follows } : p)))
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
            <Link to="/explore" className="font-medium text-gather">Explore</Link>
            <Link to="/connections" className="font-medium text-ink-soft transition hover:text-ink">Communities</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-ink">Explore the Circle</h1>
            <p className="mt-2 text-[15px] text-ink-soft">
              Find people who cherish the same quiet joys.
            </p>
          </div>
          {/* Local filter; BACKEND NOTE: the profile list view has no
              SearchFilter yet — add `filterset_fields`/SearchFilter server-side
              to make ?search= work, then debounce this into listProfiles(). */}
          <label className="flex h-11 w-full max-w-sm items-center gap-2 rounded-full border border-hairline bg-white px-4 text-sm text-ink-soft shadow-sm">
            <Search size={16} className="text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people..."
              className="w-full bg-transparent outline-none placeholder:text-ink-faint"
            />
          </label>
        </div>

        {/* People grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <article key={p.id} className="card flex flex-col items-center p-8 text-center">
              <Avatar name={p.username} size={88} ring gradient={avatarGradientFor(p.id)} to={`/profile/${p.id}`} />
              <Link to={`/profile/${p.id}`} className="mt-4 font-display text-xl font-bold text-ink transition hover:text-gather">
                {p.username}
              </Link>
              <p className="mt-1 line-clamp-1 text-sm font-medium text-gather">{p.desc ?? 'Sharing warm moments.'}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-ink-faint">
                <MapPin size={12} /> {p.location ?? 'Somewhere cozy'}
              </p>

              {/* followers/following/total_posts are annotated on the serializer */}
              <p className="mt-3 text-xs text-ink-soft">
                <span className="font-semibold text-ink">{p.followers}</span> followers
                <span className="mx-2 text-hairline">·</span>
                <span className="font-semibold text-ink">{p.total_posts}</span> moments
              </p>

              {/* user_follows from UserProfileSerializer drives the state */}
              <button
                type="button"
                onClick={() => follow(p.id)}
                className={`mt-5 inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition ${
                  p.user_follows
                    ? 'border border-hairline bg-white text-ink hover:border-red-200 hover:text-red-500'
                    : 'btn-gather shadow-pill'
                }`}
              >
                {p.user_follows ? <UserCheck size={16} /> : <UserPlus size={16} />}
                {p.user_follows ? 'Following' : 'Follow'}
              </button>

              {/* follows_user: whether this person follows the viewer — small badge */}
              {p.follows_user && (
                <p className="mt-2 text-[11px] tracking-wide text-ink-faint uppercase">Follows you</p>
              )}
            </article>
          ))}
          {visible.length === 0 && <p className="card col-span-full p-10 text-center text-ink-soft">No people match your search yet.</p>}
        </div>
      </main>
    </div>
  )
}
