/**
 * Left sidebar (desktop): section nav + "Invite a Friend" promo card.
 * Nav destinations other than Home/Profile have no backend feature yet
 * (Explore / My Circles / Saved Reads / Settings are UI-only routes).
 */
import { Compass, Home, Bookmark, Settings, Users, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Home Feed', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/circles', label: 'My Circles', icon: Users },
  { to: '/saved', label: 'Saved Reads', icon: Bookmark },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <nav className="sticky top-[88px] space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] transition ${
                isActive
                  ? 'bg-white font-semibold text-gather shadow-card'
                  : 'font-medium text-ink-soft hover:bg-white/60 hover:text-ink'
              }`
            }
          >
            <Icon size={20} strokeWidth={2.2} />
            {label}
          </NavLink>
        ))}

        {/* Invite promo — UI-only (no referral backend). "Get Invite Link" is a stub. */}
        <div className="mt-8 rounded-3xl bg-butter p-6 text-center">
          <h3 className="text-base font-semibold text-ink">Invite a Friend</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Sharing warmth is better together. Get 500 bonus warmth points.
          </p>
          <button type="button" className="mt-4 w-full rounded-full bg-white py-2.5 text-sm font-semibold text-gather shadow-card transition hover:opacity-90">
            Get Invite Link
          </button>
        </div>
      </nav>
    </aside>
  )
}

/** Mobile drawer version of the same nav (opened from the feed header). */
export function MobileSidebar({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="absolute top-0 left-0 h-full w-64 bg-cream p-4 shadow-xl">
        <button type="button" onClick={onClose} className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-white" aria-label="Close menu">
          <X size={20} />
        </button>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] ${
                isActive ? 'bg-white font-semibold text-gather shadow-card' : 'font-medium text-ink-soft'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
