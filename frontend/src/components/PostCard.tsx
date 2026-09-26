/**
 * Feed post card, matching the home-screen design.
 *
 * Data comes from PostSerializer:
 *   post.user.username   -> author line
 *   post.created_at      -> relative time
 *   post.post            -> first line renders as the title, rest as body
 *   post.image           -> when set, a real <img>; mocks render placeholders
 *   post.total_likes / total_comments
 *   post.is_liked / is_saved -> optimistic toggles
 */
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar, { avatarGradientFor } from './Avatar'
import type { Post } from '../data/mock'

/** Friendly relative time for created_at. */
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

/** Title = text before the first sentence break, body = the rest. */
function splitTitleBody(text: string): [string, string] {
  const [first, ...rest] = text.split('. ')
  return [first, rest.join('. ')]
}

interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onSave: (postId: string) => void
  onComment: (postId: string) => void
}

export default function PostCard({ post, onLike, onSave, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [draft, setDraft] = useState('')

  const [title, body] = splitTitleBody(post.post)

  const like = () => {
    // Optimistic UI; the actual call is commented in lib/api.ts#toggleLike
    // BACKEND: POST /posts/<post_id>/like
    onLike(post.post_id)
  }

  const save = () => {
    // BACKEND: POST /posts/<post_id>/save
    onSave(post.post_id)
  }

  const submitComment = () => {
    if (!draft.trim()) return
    // BACKEND: POST /posts/<post_id>/comments  body: { comment }
    onComment(post.post_id)
    setDraft('')
  }

  return (
    <article className="card overflow-hidden">
      {/* Author header */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4">
        <Avatar
          userId={post.user.id}
          name={post.user.username}
          size={44}
          gradient={avatarGradientFor(post.user.id)}
          to={`/profile/${post.user.id}`}
        />
        <div className="min-w-0">
          <Link to={`/profile/${post.user.id}`} className="block truncate text-[15px] font-semibold text-ink hover:text-gather">
            {post.user.username}
          </Link>
          <span className="text-xs text-ink-faint">{timeAgo(post.created_at)}</span>
        </div>
        <button type="button" className="ml-auto rounded-full p-2 text-ink-faint transition hover:bg-cream hover:text-ink-soft" aria-label="Post options">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media: real image when the API returns one, otherwise the editorial
          placeholder art from the designs. Clicking through opens the post
          detail page -> BACKEND: GET /posts/<post_id>. */}
      <Link to={`/post/${post.post_id}`} aria-label={`Open post: ${title}`}>
        {post.image ? (
          <img src={post.image} alt={title} className="mx-6 mb-4 aspect-[4/3] w-[calc(100%-3rem)] rounded-2xl object-cover" />
        ) : (
          <PlaceholderArt postId={post.post_id} title={title} />
        )}
      </Link>

      {/* Title + body */}
      <div className="px-6 pb-2">
        <Link to={`/post/${post.post_id}`}>
          <h2 className="font-display text-[26px] leading-snug font-bold text-ink transition hover:text-gather">{title}</h2>
        </Link>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          {body || 'Finding peace in the quiet moments of the morning with a fresh brew and my favorite classic novel. The light hitting the pages is just magic today. ✨'}
        </p>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-5 px-6 py-4">
        <button
          type="button"
          onClick={like}
          className={`flex items-center gap-1.5 text-sm transition ${post.is_liked ? 'text-gather' : 'text-ink-soft hover:text-gather'}`}
          aria-pressed={post.is_liked}
        >
          <Heart size={20} fill={post.is_liked ? 'currentColor' : 'none'} />
          {formatCount(post.total_likes)}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowComments((s) => !s)
            setCommentsOpen(false)
          }}
          className="flex items-center gap-1.5 text-sm text-ink-soft transition hover:text-gather"
        >
          <MessageCircle size={20} />
          {formatCount(post.total_comments)}
        </button>

        {/* Share — no share endpoint; UI-only (copies post_url in a real app). */}
        <button type="button" className="text-ink-soft transition hover:text-gather" aria-label="Share post">
          <Send size={20} />
        </button>

        <button
          type="button"
          onClick={save}
          className={`ml-auto transition ${post.is_saved ? 'text-gather' : 'text-ink-soft hover:text-gather'}`}
          aria-pressed={post.is_saved}
          aria-label="Save post"
        >
          <Bookmark size={20} fill={post.is_saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Inline comments drawer (list + add).
          Data via BACKEND: GET /posts/<post_id>/comments (see lib/api.ts#listComments). */}
      {showComments && (
        <div className="border-t border-hairline bg-cream/60 px-6 py-4">
          {(commentsOpen ? fakeComments(post) : fakeComments(post).slice(0, 1)).map((c) => (
            <div key={c.id} className="mb-3 flex gap-3">
              <Avatar name={c.user} size={32} userId={c.id + 10} />
              <div>
                <p className="text-sm font-semibold text-ink">
                  {c.user} <span className="ml-1 font-normal text-xs text-ink-faint">· {timeAgo(c.created_at)}</span>
                </p>
                <p className="text-sm text-ink-soft">{c.comment}</p>
              </div>
            </div>
          ))}
          {!commentsOpen && fakeComments(post).length > 1 && (
            <button type="button" onClick={() => setCommentsOpen(true)} className="text-sm font-medium text-gather">
              View all comments
            </button>
          )}
          <div className="mt-2 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Add a warm comment..."
              className="h-10 w-full rounded-full border border-hairline bg-white px-4 text-sm outline-none placeholder:text-ink-faint focus:border-gather/50"
            />
            <button type="button" onClick={submitComment} className="btn-gather h-10 px-4 text-sm">
              Send
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

/** Stand-in for GET /posts/<post_id>/comments until the API is wired. */
function fakeComments(post: Post) {
  return [
    { id: 1, user: 'Coco Chen', comment: 'This is the exact energy I needed today ☕', created_at: post.created_at },
    { id: 2, user: 'David Osei', comment: 'The light in this one… perfect.', created_at: post.created_at },
  ]
}

/**
 * Editorial placeholder art for posts whose `image` is null in the mock —
 * reproduces the "SUNDAY MORNING READS" card and the autumn illustration
 * from the approved design without shipping binary assets.
 */
function PlaceholderArt({ postId, title }: { postId: string; title: string }) {
  if (postId.endsWith('0001')) {
    return (
      <div className="mx-6 mb-4 flex aspect-[4/3] flex-col items-center justify-center rounded-2xl bg-cream-deep px-8 text-center">
        <h3 className="font-display text-4xl font-bold tracking-wide text-ink uppercase">
          {title.split(' ').slice(0, 2).join(' ')}
          <span className="inline-block rotate-12">☀</span>
        </h3>
        <h3 className="font-display text-4xl font-bold tracking-wide text-ink uppercase">{title.split(' ').slice(-1)}</h3>
        <div className="mt-4 space-y-1 text-[10px] tracking-[0.3em] text-ink-faint uppercase">
          <p>Minimum drama, soft light, good words</p>
          <p>Nature is not a place to visit but a home</p>
          <p>Saffer for the soul work</p>
        </div>
        <p className="mt-4 text-[9px] tracking-[0.35em] text-ink-faint uppercase">wanderings &amp; mornings club</p>
      </div>
    )
  }
  return (
    <div
      className="mx-6 mb-4 aspect-[4/3] rounded-2xl"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 100%, #2f4438 0%, #2f4438 28%, transparent 28.5%), linear-gradient(180deg, #fde8cf 0%, #f8d9b0 55%, #f3c892 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* simple tree illustration built from divs */}
      <div className="absolute top-[18%] left-1/2 h-[26%] w-[3px] -translate-x-1/2 rounded bg-[#5b4632]" />
      <div className="absolute top-[8%] left-1/2 h-[42%] w-[70%] -translate-x-1/2 rounded-[45%] bg-[radial-gradient(circle_at_35%_35%,#f59e0b_0%,#ea7c1c_45%,#c2570f_100%)] opacity-95" />
      <div className="absolute bottom-[26%] left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-[#4a5d43]/60" />
    </div>
  )
}
