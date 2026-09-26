/**
 * "Share Warmth" composer modal -> BACKEND: POST /posts/
 * with { post, image?, visibility } (multipart when an image is attached).
 * Django then triggers the Celery post-created email task server-side.
 *
 * The send action below is intentionally a stub: no backend call is made,
 * the new post is prepended to the local feed state instead.
 */
import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'
import Avatar from './Avatar'
import { currentUser } from '../data/mock'

interface ShareWarmthModalProps {
  open: boolean
  onClose: () => void
  onShare: (text: string) => void
}

export default function ShareWarmthModal({ open, onClose, onShare }: ShareWarmthModalProps) {
  const [text, setText] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')

  if (!open) return null

  const share = () => {
    if (!text.trim()) return
    // BACKEND: POST /posts/ (lib/api.ts#createPost) — commented out;
    // onShare() prepends the post to the mock feed for now.
    onShare(text.trim())
    setText('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Share warmth">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="card relative w-full max-w-lg p-6">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 rounded-full p-2 text-ink-faint hover:bg-cream" aria-label="Close">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <Avatar userId={currentUser.id} name="Emily Sunny" size={44} gradient={currentUser.avatarGradient} />
          <div>
            <p className="text-sm font-semibold text-ink">Emily Sunny</p>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
              className="rounded-full bg-cream px-2 py-0.5 text-xs text-ink-soft outline-none"
              aria-label="Post visibility"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          autoFocus
          placeholder="Share a warm moment with your circle..."
          className="mt-4 w-full resize-none rounded-2xl border border-hairline bg-cream/60 p-4 text-[15px] outline-none placeholder:text-ink-faint focus:border-gather/50"
        />

        <div className="mt-4 flex items-center justify-between">
          {/* Image upload -> BACKEND: image field on POST /posts/ (ImageField).
              UI-only here. */}
          <button type="button" className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-ink-soft transition hover:bg-cream hover:text-gather">
            <ImagePlus size={18} />
            Photo
          </button>
          <button type="button" onClick={share} disabled={!text.trim()} className="btn-gather h-11 px-6 text-sm shadow-pill">
            Share Warmth
          </button>
        </div>
      </div>
    </div>
  )
}
