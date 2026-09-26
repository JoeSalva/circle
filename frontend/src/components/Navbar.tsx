/**
 * App top bar for the home feed (left: logo + global search; right:
 * Share Warmth, notifications, profile avatar).
 *
 * BACKEND notes live on the individual controls below.
 */
import { Bell, CirclePlus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { currentUser } from '../data/mock'

interface NavbarProps {
  query: string
  onQueryChange: (q: string) => void
  onShare: () => void
}

export default function Navbar({ query, onQueryChange, onShare }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-cream/90 backdrop-blur">
      <div className="flex h-[72px] items-center gap-4 px-6">
        <Link to="/" className="font-display text-3xl font-bold italic text-gather">
          Gather
        </Link>

        {/* Global search -> BACKEND: GET /posts/?search=<q> (PostListCreateAPIView
            wires SearchFilter over user__username + post text). */}
        <label className="ml-6 flex h-11 w-full max-w-md items-center gap-2 rounded-full border border-hairline bg-white px-4 text-sm text-ink-soft shadow-sm">
          <Search size={16} className="text-ink-faint" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search for warmth, people, or circles..."
            className="w-full bg-transparent outline-none placeholder:text-ink-faint"
          />
        </label>

        <div className="ml-auto flex items-center gap-3">
          {/* Share Warmth opens the composer modal in HomeFeed.tsx ->
              BACKEND: POST /posts/ */}
          <button
            type="button"
            onClick={onShare}
            className="btn-gather hidden h-11 px-5 text-sm shadow-pill sm:inline-flex"
          >
            <CirclePlus size={18} />
            Share Warmth
          </button>

          {/* Notifications — UI-only mock; no notifications endpoint in the API. */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition hover:bg-white"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          {/* Profile avatar -> routes to the profile screen.
              BACKEND: GET /user/me/profile/ is fetched by the profile page. */}
          <Link to="/profile" aria-label="Your profile">
            <Avatar userId={currentUser.id} name="Emily Sunny" size={40} gradient={currentUser.avatarGradient} />
          </Link>
        </div>
      </div>
    </header>
  )
}
