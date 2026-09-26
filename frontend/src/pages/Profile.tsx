/**
 * Profile screen (profile_screen.png).
 *
 * Data flow (commented calls live in lib/api.ts):
 *   myProfile()    -> GET /user/me/profile/        (header card)
 *   myPosts()      -> GET /user/me/posts/?page=    ("Scrapbook" grid)
 *   likedPosts()   -> GET /liked/posts/?page=      ("Journal" tab)
 *   savedPosts()   -> GET /saved/posts/?page=      ("Saved" tab)
 *   userProfile() / userPosts() when viewing /profile/:userId
 *   updateProfile()-> PATCH /user/me/profile/      (Edit Profile)
 *   toggleFollow()-> POST /follow/user/<id>        (when viewing others)
 *
 * Warmth counts and story highlights are UI-only mocks (no API endpoints).
 */
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Bell, Bookmark, ChevronDown, Heart, LayoutGrid, MapPin, Moon, NotebookPen, Pencil, Plus, Search, Sun, UserCheck, UserPlus, X } from 'lucide-react'
import Avatar, { avatarGradientFor } from '../components/Avatar'
import { mockHighlights, mockMoments, mockProfile, currentUser, type Profile as ProfileType } from '../data/mock'

const TABS = [
  { key: 'scrapbook', label: 'Scrapbook', icon: LayoutGrid },
  { key: 'journal', label: 'Journal', icon: NotebookPen },
  { key: 'saved', label: 'Saved', icon: Bookmark },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function Profile() {
  const { userId } = useParams() // undefined -> own profile
  const isOwn = !userId
  const navigate = useNavigate()

  // BACKEND: useEffect -> isOwn ? myProfile() : userProfile(Number(userId))
  //   (PrivateProfileSerializer vs UserProfileSerializer; the public variant
  //    also returns user_follows for the Follow button state below.)
  const [profile, setProfile] = useState<ProfileType>(mockProfile)

  const [tab, setTab] = useState<TabKey>('scrapbook')
  const [dark, setDark] = useState(false)
  const [editing, setEditing] = useState(false)
  // For other users' profiles: user_follows on UserProfileSerializer.
  const [following, setFollowing] = useState(false)

  // BACKEND: replace with myPosts()/userPosts()/savedPosts() per active tab.
  const moments = useMemo(() => {
    if (tab === 'journal') return mockMoments.slice(0, 6)
    if (tab === 'saved') return mockMoments.slice(2, 8)
    return mockMoments
  }, [tab])

  return (
    <div className="min-h-screen pb-16">
      {/* Simple top nav (per design: Home / Explore / Communities + icons) */}
      <header className="border-b border-hairline bg-cream/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
          <Link to="/" className="font-display text-2xl font-bold italic text-gather">
            Gather
          </Link>
          <nav className="flex gap-6 text-[15px]">
            <Link to="/" className="font-medium text-gather">Home</Link>
            <a href="#" className="font-medium text-ink-soft transition hover:text-ink">Explore</a>
            <a href="#" className="font-medium text-ink-soft transition hover:text-ink">Communities</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-white" aria-label="Search">
              <Search size={19} />
            </button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-white" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <Avatar userId={currentUser.id} name="Emily Sunny" size={36} gradient={currentUser.avatarGradient} />
            {/* Dark mode — UI-only (no themed styles shipped yet). */}
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-white"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-6xl px-6">
        {/* Profile header card */}
        <section className="card p-8">
          <div className="flex flex-wrap items-start gap-8">
            <div className="relative">
              <Avatar name={profile.username} size={112} ring gradient={avatarGradientFor(currentUser.id)} />
              {/* Edit badge on the avatar (own profile only) -> opens the
                  edit dialog wired to PATCH /user/me/profile/. */}
              {isOwn && (
                <button
                  type="button"
                  className="absolute right-1 bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gather shadow-card"
                  aria-label="Edit avatar"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="font-display text-4xl font-bold text-ink">{profile.username}</h1>
                {isOwn ? (
                  <div className="ml-auto flex gap-3">
                    {/* Opens EditProfileModal -> BACKEND: PATCH /user/me/profile/ */}
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="h-11 rounded-full border border-hairline bg-white px-5 text-sm font-medium text-ink transition hover:border-gather/40"
                    >
                      Edit Profile
                    </button>
                    <button type="button" className="btn-gather h-11 px-5 text-sm shadow-pill">
                      <Heart size={16} /> Share Warmth
                    </button>
                  </div>
                ) : (
                  <div className="ml-auto">
                    {/* BACKEND: toggleFollow(Number(userId)) — optimistic
                        toggle of user_follows from UserProfileSerializer. */}
                    <button
                      type="button"
                      onClick={() => setFollowing((f) => !f)}
                      className={following ? 'inline-flex h-11 items-center gap-2 rounded-full border border-hairline bg-white px-6 text-sm font-medium text-ink transition hover:border-red-200 hover:text-red-500' : 'btn-gather h-11 px-6 text-sm shadow-pill'}
                    >
                      {following ? <UserCheck size={16} /> : <UserPlus size={16} />}
                      {following ? 'Following' : 'Follow'}
                    </button>
                  </div>
                )}
              </div>

              <p className="mt-2 text-[15px] font-medium text-gather">
                {profile.desc ?? 'Sharing warm moments.'} <span aria-hidden>☀️</span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink-faint">
                <MapPin size={14} /> {profile.location ?? 'Somewhere cozy'}
              </p>

              {/* Stats — warmth is UI-only; Friends links to /connections
                  (GET /user/me/followers/ + /user/me/following/). */}
              <div className="mt-6 grid max-w-xl grid-cols-3 gap-4">
                <div className="rounded-2xl bg-cream px-4 py-3 text-center">
                  <p className="text-lg font-bold text-ink">2.4k</p>
                  <p className="text-[11px] font-medium tracking-widest text-ink-faint uppercase">Warmth</p>
                </div>
                <button
                  type="button"
                  onClick={() => isOwn && navigate('/connections')}
                  className="rounded-2xl bg-cream px-4 py-3 text-center transition hover:bg-gather-tint"
                >
                  <p className="text-lg font-bold text-ink">{profile.followers}</p>
                  <p className="text-[11px] font-medium tracking-widest text-ink-faint uppercase">Friends</p>
                </button>
                <div className="rounded-2xl bg-cream px-4 py-3 text-center">
                  <p className="text-lg font-bold text-ink">{profile.total_posts}</p>
                  <p className="text-[11px] font-medium tracking-widest text-ink-faint uppercase">Moments</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story highlights */}
        <section className="mt-10 no-scrollbar flex gap-8 overflow-x-auto">
          {mockHighlights.map((h, i) => (
            <button key={h.id} type="button" className="flex w-16 flex-col items-center gap-2">
              {i === 0 ? (
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gather/60 text-gather">
                  <Plus size={22} />
                </span>
              ) : (
                <Avatar name={h.label} size={64} ring gradient={avatarGradientFor(h.id)} />
              )}
              <span className="text-xs font-medium text-ink-soft">{h.label}</span>
            </button>
          ))}
        </section>

        {/* Tabs */}
        <div className="mt-10 flex justify-center gap-10 border-b border-hairline">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-2 pb-3 text-[15px] transition ${
                tab === key ? 'border-gather font-semibold text-gather' : 'border-transparent font-medium text-ink-soft hover:text-ink'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>

        {/* Moments masonry grid */}
        <div className="mt-8 columns-2 gap-6 md:columns-3">
          {moments.map((m) => (
            <div key={m.id} className="mb-6 break-inside-avoid">
              {m.kind === 'quote' ? (
                // Quote card — UI-only content type (no API counterpart).
                <div className="card flex min-h-40 flex-col items-center justify-center border-dashed bg-parchment/60 p-8 text-center">
                  <span className="font-display text-4xl text-gather">"</span>
                  <p className="font-display text-lg font-semibold text-ink italic">{m.text}</p>
                </div>
              ) : m.kind === 'caption' ? (
                // Caption card — mirrors a post whose caption rides with an image.
                <div className="card overflow-hidden border-0 bg-parchment/70 p-4">
                  <div className="aspect-[4/3] rounded-xl" style={{ background: m.gradient }} />
                  <p className="mt-3 text-sm font-medium text-ink">{m.text}</p>
                </div>
              ) : (
                <div
                  className="w-full rounded-3xl shadow-card"
                  style={{ background: m.gradient, aspectRatio: m.tall ? '3/4' : '4/3' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Floating compose button — opens the share composer.
            BACKEND: POST /posts/ (createPost in lib/api.ts). */}
        <button
          type="button"
          className="fixed right-8 bottom-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gather text-white shadow-pill transition hover:opacity-90"
          aria-label="New moment"
        >
          <Plus size={24} />
        </button>

        <div className="mt-12 text-center">
          {/* BACKEND: next page of the active tab's endpoint (paginated). */}
          <button type="button" className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-ink-soft transition hover:bg-white hover:text-gather">
            <ChevronDown size={16} /> View Older Memories
          </button>
        </div>
      </main>

      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={(desc, location) => {
            // BACKEND: PATCH /user/me/profile/ { desc, location }
            //   await updateProfile({ desc, location })
            setProfile((p) => ({ ...p, desc, location }))
            setEditing(false)
          }}
        />
      )}
    </div>
  )
}

/**
 * Edit Profile modal -> BACKEND: PATCH /user/me/profile/ { desc, location }
 * (updateProfile() in lib/api.ts). Username is read-only on the model.
 */
function EditProfileModal({
  profile,
  onClose,
  onSave,
}: {
  profile: ProfileType
  onClose: () => void
  onSave: (desc: string, location: string) => void
}) {
  const [desc, setDesc] = useState(profile.desc ?? '')
  const [location, setLocation] = useState(profile.location ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Edit profile">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="card relative w-full max-w-md p-6">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 rounded-full p-2 text-ink-faint hover:bg-cream" aria-label="Close">
          <X size={18} />
        </button>

        <h2 className="font-display text-2xl font-bold text-ink">Edit Profile</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Signed in as <span className="font-medium text-ink">{profile.username}</span>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSave(desc.trim(), location.trim())
          }}
          className="mt-6 space-y-5"
        >
          <div>
            <label htmlFor="bio" className="mb-2 block text-xs font-semibold tracking-wider text-ink uppercase">
              Bio
            </label>
            <input
              id="bio"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={45}
              placeholder="Coffee lover & sunset chaser ☀️"
              className="h-12 w-full rounded-2xl border border-hairline bg-parchment px-5 text-[15px] outline-none placeholder:text-ink-faint focus:border-gather/50"
            />
            {/* BACKEND NOTE: Profile.desc is CharField(max_length=45). */}
          </div>
          <div>
            <label htmlFor="location" className="mb-2 block text-xs font-semibold tracking-wider text-ink uppercase">
              Location
            </label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={20}
              placeholder="New York, NY"
              className="h-12 w-full rounded-2xl border border-hairline bg-parchment px-5 text-[15px] outline-none placeholder:text-ink-faint focus:border-gather/50"
            />
            {/* BACKEND NOTE: Profile.location is CharField(max_length=20). */}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm text-ink-soft hover:bg-cream">
              Cancel
            </button>
            <button type="submit" className="btn-gather h-11 px-6 text-sm shadow-pill">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

