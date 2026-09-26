/**
 * Right rail: "My Warmth" stats card, "Trending Circles" list, footer links.
 *
 * Warmth points & circles have NO backend endpoints (UI-only mocks). The
 * 150 "friends" figure maps to followers from GET /user/me/profile/ and the
 * Join buttons would call BACKEND: POST /follow/user/<id> via toggleFollow().
 */
import { Flame, Leaf, BookOpen, ChevronDown } from 'lucide-react'
import { mockCircles } from '../data/mock'

const CIRCLE_ICONS = [Flame, Leaf, BookOpen]

export default function RightRail() {
  return (
    <aside className="hidden w-72 shrink-0 space-y-6 xl:block">
      {/* My Warmth — points system is UI-only; followers (150) would come from
          BACKEND: GET /user/me/profile/ -> followers field. */}
      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">My Warmth</h2>
          <Flame size={20} className="text-gather" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-cream py-4 text-center">
            <p className="text-2xl font-bold text-ember">2.4k</p>
            <p className="mt-1 text-[11px] font-medium tracking-widest text-ink-faint uppercase">Earned</p>
          </div>
          <div className="rounded-2xl bg-cream py-4 text-center">
            <p className="text-2xl font-bold text-ink">150</p>
            <p className="mt-1 text-[11px] font-medium tracking-widest text-ink-faint uppercase">Friends</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-soft">Weekly Goal</span>
            <span className="font-semibold text-ink">85%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream">
            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-gather-soft to-gather" />
          </div>
        </div>
      </section>

      {/* Trending Circles — UI-only data; Join -> toggleFollow() (see lib/api.ts). */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-ink">Trending Circles</h2>
        <ul className="mt-4 space-y-4">
          {mockCircles.map((circle, i) => {
            const Icon = CIRCLE_ICONS[i % CIRCLE_ICONS.length]
            return (
              <li key={circle.id} className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{ background: circle.gradient }}
                >
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{circle.name}</p>
                  <p className="text-xs text-ink-faint">{circle.members}</p>
                </div>
                <button
                  type="button"
                  className="ml-auto rounded-full bg-gather-tint px-4 py-1.5 text-xs font-semibold text-gather transition hover:bg-gather hover:text-white"
                >
                  Join
                </button>
              </li>
            )
          })}
        </ul>
        <button type="button" className="mt-5 w-full text-center text-sm font-medium text-ink-soft transition hover:text-gather">
          Explore All Circles
        </button>
      </section>

      <footer className="px-2 text-xs leading-relaxed text-ink-faint">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a href="#" className="hover:text-ink-soft">About</a>
          <a href="#" className="hover:text-ink-soft">Help Center</a>
          <a href="#" className="hover:text-ink-soft">Terms</a>
          <a href="#" className="hover:text-ink-soft">Privacy</a>
          <a href="#" className="hover:text-ink-soft">Cookies</a>
        </div>
        <p className="mt-2">© 2024 Gather Inc.</p>
      </footer>
    </aside>
  )
}

/** "View Older Memories" pagination control.
 *  BACKEND: fetch the next page from /posts/ using the `next` URL the
 *  paginated response provides (see lib/api.ts#listPosts). */
export function ViewOlderButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mx-auto flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-ink-soft transition hover:bg-white hover:text-gather">
      <ChevronDown size={16} />
      View Older Memories
    </button>
  )
}
