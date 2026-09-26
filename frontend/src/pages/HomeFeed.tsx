/**
 * Home feed screen (home_screen.png).
 *
 * Data flow (all commented calls live in lib/api.ts):
 *   listPosts()          -> GET /posts/?search=&ordering=-created_at  (feed)
 *   toggleLike()         -> POST /posts/<post_id>/like
 *   toggleSave()         -> POST /posts/<post_id>/save
 *   createPost()         -> POST /posts/                              (composer)
 *   "View Older Memories" -> next page from the paginated /posts/ response
 *
 * Stories, filter chips, warmth stats and circles are UI-only mocks.
 */
import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar, { MobileSidebar } from '../components/Sidebar'
import Stories from '../components/Stories'
import PostCard from '../components/PostCard'
import RightRail, { ViewOlderButton } from '../components/RightRail'
import ShareWarmthModal from '../components/ShareWarmthModal'
import { mockPosts, type Post } from '../data/mock'

const CHIPS = ['All', 'Lifestyle', 'Interiors', 'Travel']

/** Feed sources: For You = GET /posts/, Following = GET /following/posts/. */
type FeedSource = 'foryou' | 'following'

export default function HomeFeed() {
  const [query, setQuery] = useState('')
  const [chip, setChip] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)
  const [source, setSource] = useState<FeedSource>('foryou')
  const [posts, setPosts] = useState<Post[]>(mockPosts)

  // BACKEND: switching tabs re-fetches — listPosts() vs listFollowingPosts().
  // Mocked: Following simply narrows to the first two fixtures.

  const visible = useMemo(() => {
    const scoped = source === 'following' ? posts.slice(0, 2) : posts
    return scoped.filter((p) => {
      const matchesQuery = `${p.user.username} ${p.post}`.toLowerCase().includes(query.toLowerCase())
      const matchesChip = chip === 'All' // categories have no backend field yet
      return matchesQuery && matchesChip
    })
  }, [posts, query, chip, source])

  const like = (postId: string) => {
    // Optimistic toggle; real impl: await toggleLike(postId) then sync counts.
    setPosts((ps) =>
      ps.map((p) =>
        p.post_id === postId ? { ...p, is_liked: !p.is_liked, total_likes: p.total_likes + (p.is_liked ? -1 : 1) } : p,
      ),
    )
  }

  const save = (postId: string) => {
    // Optimistic toggle; real impl: await toggleSave(postId).
    setPosts((ps) => ps.map((p) => (p.post_id === postId ? { ...p, is_saved: !p.is_saved } : p)))
  }

  const openComments = (_postId: string) => {
    // BACKEND: GET /posts/<post_id>/comments then POST to add — PostCard
    // renders the drawer; wire listComments()/addComment() there.
  }

  const share = (text: string) => {
    // Composer submit — real impl: await createPost({ post: text }) then
    // refresh the feed from GET /posts/.
    setPosts((ps) => [
      {
        post_id: crypto.randomUUID(),
        post: text,
        image: null,
        user: { id: 1, username: 'Emily Sunny' },
        total_comments: 0,
        is_liked: false,
        total_likes: 0,
        is_saved: false,
        visibility: 'public',
        post_url: '#',
        created_at: new Date().toISOString(),
      },
      ...ps,
    ])
  }

  const loadOlder = () => {
    // BACKEND: GET <next> from the paginated /posts/ response and append.
  }

  return (
    <div className="min-h-screen">
      <Navbar query={query} onQueryChange={setQuery} onShare={() => setComposerOpen(true)} />

      {/* Mobile header nav (hamburger) */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gather text-white shadow-pill lg:hidden"
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="mx-auto flex max-w-[1440px] gap-8 px-6 py-8">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Stories />

          {/* Feed source tabs — For You -> GET /posts/,
              Following -> GET /following/posts/ (lib/api.ts). */}
          <div className="mt-6 inline-flex rounded-full border border-hairline bg-white p-1 shadow-sm">
            {(
              [
                ['foryou', 'For You'],
                ['following', 'Following'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSource(key)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  source === key ? 'bg-gather text-white shadow-pill' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Filter chips — categories have no backend field; UI-only. */}
          <div className="mt-6 flex gap-3">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChip(c)}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  chip === c ? 'bg-gather text-white shadow-pill' : 'border border-hairline bg-white text-ink-soft hover:text-ink'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Feed — BACKEND: paginated PostSerializer results. */}
          <div className="mt-8 space-y-10">
            {visible.map((post) => (
              <PostCard key={post.post_id} post={post} onLike={like} onSave={save} onComment={openComments} />
            ))}
            {visible.length === 0 && (
              <p className="card p-10 text-center text-ink-soft">No moments match your search yet.</p>
            )}
          </div>

          <div className="py-10 text-center">
            <ViewOlderButton onClick={loadOlder} />
          </div>
        </main>

        <RightRail />
      </div>

      {menuOpen && <MobileSidebar onClose={() => setMenuOpen(false)} />}
      <ShareWarmthModal open={composerOpen} onClose={() => setComposerOpen(false)} onShare={share} />
    </div>
  )
}
