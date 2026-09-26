/**
 * Stories rail ("My Story / Anna / Ben / ...").
 * Stories have NO backend counterpart (the API models posts, not 24h stories)
 * — UI-only mock data from data/mock.ts.
 */
import { Plus } from 'lucide-react'
import Avatar, { avatarGradientFor } from './Avatar'
import { mockStories } from '../data/mock'

export default function Stories() {
  return (
    <div className="no-scrollbar flex gap-6 overflow-x-auto pb-2">
      {mockStories.map((story, i) => (
        <button key={story.id} type="button" className="flex w-16 flex-col items-center gap-2">
          {i === 0 ? (
            // "My Story" add-state: dashed circle + plus, per design.
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-gather/60 text-gather">
              <Plus size={20} />
            </span>
          ) : (
            <Avatar name={story.label} size={56} ring gradient={avatarGradientFor(story.id)} />
          )}
          <span className="w-full truncate text-center text-xs font-medium text-ink-soft">{story.label}</span>
        </button>
      ))}
    </div>
  )
}
