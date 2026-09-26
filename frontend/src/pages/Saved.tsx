/**
 * Saved Reads screen (/saved).
 *
 * BACKEND mapping (stub in lib/api.ts):
 *   savedPosts() -> GET /saved/posts/?page=
 *     PostSerializer list where the server forces is_saved=true via the
 *     saved_post_endpoint serializer context flag. Toggle-save here removes
 *     the post via POST /posts/<post_id>/save (toggle endpoint).
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import ShareWarmthModal from '../components/ShareWarmthModal'
import { mockPosts, type Post } from '../data/mock'

export default function Saved() {
  // BACKEND: useEffect -> savedPosts() (GET /saved/posts/).
  const [posts, setPosts] = useState<Post[]>(mockPosts.filter((p) => p.is_saved))
  const [query, setQuery] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)

  const visible = posts.filter((p) => `${p.user.username} ${p.post}`.toLowerCase().includes(query.toLowerCase()))

  const like = (postId: string) => {
    // BACKEND: POST /posts/<post_id>/like
    setPosts((ps) => ps.map((p) => (p.post_id === postId ? { ...p, is_liked: !p.is_liked, total_likes: p.total_likes + (p.is_liked ? -1 : 1) } : p)))
  }

  const save = (postId: string) => {
    // BACKEND: POST /posts/<post_id>/save (toggle) — un-saving removes the
    // card on this screen, mirroring GET /saved/posts/ after the toggle.
    setPosts((ps) => ps.filter((p) => p.post_id !== postId))
  }

  const openComments = (_postId: string) => {
    // BACKEND: GET /posts/<post_id>/comments — same drawer as the feed.
  }

  return (
    <div className="min-h-screen">
      <Navbar query={query} onQueryChange={setQuery} onShare={() => setComposerOpen(true)} />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gather-tint text-gather">
            <Bookmark size={22} />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Saved Reads</h1>
            <p className="text-sm text-ink-soft">Moments you bookmarked for later.</p>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          {visible.map((post) => (
            <PostCard key={post.post_id} post={post} onLike={like} onSave={save} onComment={openComments} />
          ))}
          {visible.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-ink-soft">Nothing saved yet.</p>
              <Link to="/" className="mt-4 inline-block font-medium text-gather hover:underline">
                Browse the feed →
              </Link>
            </div>
          )}
        </div>
      </div>

      <ShareWarmthModal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onShare={() => {
          // BACKEND: POST /posts/ — new posts land in the feed, not Saved.
        }}
      />
    </div>
  )
}
