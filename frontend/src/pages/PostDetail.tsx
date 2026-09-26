/**
 * Post detail screen (/post/:postId).
 *
 * Data flow (commented calls live in lib/api.ts):
 *   getPost()      -> GET /posts/<post_id>       (SinglePostSerializer:
 *                   adds total_saves + comments_url vs the list serializer)
 *   listComments() -> GET /posts/<post_id>/comments
 *   addComment()   -> POST /posts/<post_id>/comments  { comment }
 *   updatePost()   -> PATCH /posts/<post_id>     (owner only — edit dialog)
 *   deletePost()   -> DELETE /posts/<post_id>    (owner only — then navigate home)
 *   toggleLike() / toggleSave() as on the feed
 *
 * is_liked / is_saved / is-owner come from the serializer + currentUser id;
 * when unauthenticated the API returns is_liked=false for anonymous users.
 */
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, Heart, MoreHorizontal, Pencil, Send, Trash2 } from 'lucide-react'
import Avatar, { avatarGradientFor } from '../components/Avatar'
import { mockPosts, mockCommentsByPost, currentUser, type Comment, type Post } from '../data/mock'

function timeAgo(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000))
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.round(hours / 24)
  return `${days} ${days === 1 ? 'day' : 'days'} ago`
}

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n)
}

export default function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()

  // BACKEND: useEffect -> getPost(postId) (SinglePostSerializer).
  // listPosts-style mock resolution by id suffix keeps both fixtures working.
  const post: Post = mockPosts.find((p) => p.post_id === postId) ?? mockPosts[0]
  const isOwner = post.user.id === currentUser.id

  const [postState, setPostState] = useState(post)
  const [comments, setComments] = useState<Comment[]>(mockCommentsByPost(post.post_id))
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(post.post)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const like = () => {
    // BACKEND: POST /posts/<post_id>/like — optimistic toggle.
    setPostState((p) => ({ ...p, is_liked: !p.is_liked, total_likes: p.total_likes + (p.is_liked ? -1 : 1) }))
  }

  const save = () => {
    // BACKEND: POST /posts/<post_id>/save — optimistic toggle.
    setPostState((p) => ({ ...p, is_saved: !p.is_saved }))
  }

  const submitComment = () => {
    if (!draft.trim()) return
    // BACKEND: POST /posts/<post_id>/comments  body: { comment }
    setComments((cs) => [
      {
        id: Date.now(),
        user: currentUser.username,
        comment: draft.trim(),
        image: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ...cs,
    ])
    setPostState((p) => ({ ...p, total_comments: p.total_comments + 1 }))
    setDraft('')
  }

  const saveEdit = () => {
    // BACKEND: PATCH /posts/<post_id>  { post: editText }
    setPostState((p) => ({ ...p, post: editText }))
    setEditing(false)
  }

  const destroy = () => {
    // BACKEND: DELETE /posts/<post_id> -> 204, then leave the detail page.
    navigate('/')
  }

  return (
    <div className="min-h-screen">
      {/* Slim top bar */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-ink-soft transition hover:text-gather">
            <ArrowLeft size={18} /> Back to feed
          </Link>
          <Link to="/" className="ml-auto font-display text-2xl font-bold italic text-gather">
            Gather
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <article className="card overflow-hidden">
          {/* Author row (+ owner actions) */}
          <div className="flex items-center gap-3 px-6 pt-5 pb-4">
            <Avatar
              userId={postState.user.id}
              name={postState.user.username}
              size={44}
              gradient={avatarGradientFor(postState.user.id)}
              to={`/profile/${postState.user.id}`}
            />
            <div className="min-w-0">
              <Link to={`/profile/${postState.user.id}`} className="block truncate text-[15px] font-semibold text-ink hover:text-gather">
                {postState.user.username}
              </Link>
              <span className="text-xs text-ink-faint">{timeAgo(postState.created_at)}</span>
            </div>

            <div className="ml-auto flex items-center gap-1">
              {isOwner ? (
                <>
                  {/* BACKEND: PATCH /posts/<post_id> (IsOwnerOrReadOnly) */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditText(postState.post)
                      setEditing(true)
                    }}
                    className="rounded-full p-2 text-ink-faint transition hover:bg-cream hover:text-gather"
                    aria-label="Edit post"
                  >
                    <Pencil size={18} />
                  </button>
                  {/* BACKEND: DELETE /posts/<post_id> (IsOwnerOrReadOnly) */}
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className="rounded-full p-2 text-ink-faint transition hover:bg-cream hover:text-red-500"
                    aria-label="Delete post"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <button type="button" className="rounded-full p-2 text-ink-faint transition hover:bg-cream hover:text-ink-soft" aria-label="Post options">
                  <MoreHorizontal size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Edit-in-place dialog (owner only) */}
          {editing && (
            <div className="mx-6 mb-4 rounded-2xl border border-gather/30 bg-parchment p-4">
              <label htmlFor="edit-post" className="text-xs font-semibold tracking-wider text-ink uppercase">
                Edit post
              </label>
              <textarea
                id="edit-post"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-hairline bg-white p-3 text-[15px] outline-none focus:border-gather/50"
              />
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(false)} className="rounded-full px-4 py-2 text-sm text-ink-soft hover:bg-white">
                  Cancel
                </button>
                <button type="button" onClick={saveEdit} className="btn-gather h-10 px-5 text-sm">
                  Save changes
                </button>
              </div>
            </div>
          )}

          {/* Delete confirmation (owner only) */}
          {confirmingDelete && (
            <div className="mx-6 mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-ink">Delete this moment? This can't be undone.</p>
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-full px-4 py-2 text-sm text-ink-soft hover:bg-white">
                  Cancel
                </button>
                <button type="button" onClick={destroy} className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600">
                  Delete forever
                </button>
              </div>
            </div>
          )}

          {/* Title + body (first line = title, matching the feed rendering) */}
          <div className="px-6 pb-2">
            <h1 className="font-display text-[32px] leading-snug font-bold text-ink">{postState.post.split('. ')[0]}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {postState.post.split('. ').slice(1).join('. ') ||
                'Finding peace in the quiet moments of the morning with a fresh brew and my favorite classic novel. The light hitting the pages is just magic today. ✨'}
            </p>
          </div>

          {/* Action row — same treatment as feed cards */}
          <div className="flex items-center gap-5 px-6 py-4">
            <button
              type="button"
              onClick={like}
              className={`flex items-center gap-1.5 text-sm transition ${postState.is_liked ? 'text-gather' : 'text-ink-soft hover:text-gather'}`}
              aria-pressed={postState.is_liked}
            >
              <Heart size={20} fill={postState.is_liked ? 'currentColor' : 'none'} />
              {formatCount(postState.total_likes)}
            </button>

            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
              {/* total_comments is annotated on SinglePostSerializer */}
              💬 {formatCount(comments.length)}
            </span>

            <span className="flex items-center gap-1.5 text-sm text-ink-soft">
              {/* total_saves only exists on the detail serializer */}
              🔖 {formatCount(postState.total_saves ?? 0)}
            </span>

            <button
              type="button"
              onClick={save}
              className={`ml-auto transition ${postState.is_saved ? 'text-gather' : 'text-ink-soft hover:text-gather'}`}
              aria-pressed={postState.is_saved}
              aria-label="Save post"
            >
              <Bookmark size={20} fill={postState.is_saved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </article>

        {/* Comment thread -> GET/POST /posts/<post_id>/comments */}
        <section className="card mt-8 p-6">
          <h2 className="text-lg font-semibold text-ink">Comments</h2>

          <div className="mt-4 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Add a warm comment..."
              className="h-11 w-full rounded-full border border-hairline bg-cream/60 px-4 text-sm outline-none placeholder:text-ink-faint focus:border-gather/50"
            />
            <button type="button" onClick={submitComment} className="btn-gather h-11 px-5 text-sm shadow-pill" disabled={!draft.trim()}>
              <Send size={16} /> Send
            </button>
          </div>

          <ul className="mt-6 space-y-5">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <Avatar name={c.user} size={38} userId={c.id + 10} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {c.user} <span className="ml-1 font-normal text-xs text-ink-faint">· {timeAgo(c.created_at)}</span>
                  </p>
                  <p className="text-[15px] text-ink-soft">{c.comment}</p>
                </div>
              </li>
            ))}
            {comments.length === 0 && <li className="text-sm text-ink-faint">No comments yet — start the warmth.</li>}
          </ul>
        </section>
      </main>
    </div>
  )
}
