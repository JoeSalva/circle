/**
 * Avatar with warm gradient rings, matching the story/highlight treatment in
 * the designs. The backend User model has no avatar field, so we render
 * initials over a deterministic gradient (UI-only mock — swap for
 * `user.profile.avatar` here if an avatar field is added later).
 */
import { Link } from 'react-router-dom'

const PALETTES = [
  'linear-gradient(135deg, #FDBA74, #F97316)',
  'linear-gradient(135deg, #F9A8D4, #EC4899)',
  'linear-gradient(135deg, #93C5FD, #3B82F6)',
  'linear-gradient(135deg, #FCD34D, #F59E0B)',
  'linear-gradient(135deg, #A3A3A3, #525252)',
]

export function avatarGradientFor(id: number): string {
  return PALETTES[Math.abs(id) % PALETTES.length]
}

interface AvatarProps {
  userId?: number
  name: string
  size?: number
  ring?: boolean
  gradient?: string
  to?: string
}

export default function Avatar({ userId = 0, name, size = 40, ring = false, gradient, to }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const inner = (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-medium text-white select-none"
      style={{ width: size, height: size, background: gradient ?? avatarGradientFor(userId), fontSize: size * 0.36 }}
      aria-hidden={false}
      title={name}
    >
      {initials}
    </span>
  )

  if (!ring) {
    return to ? (
      <Link to={to} className="shrink-0">
        {inner}
      </Link>
    ) : (
      inner
    )
  }

  // Ringed variant used by stories/highlights — dashed ring for "add" state.
  return (
    <span
      className="inline-flex items-center justify-center rounded-full p-[3px]"
      style={{ background: gradient ?? avatarGradientFor(userId) }}
    >
      <span className="rounded-full bg-white p-[2px]">{inner}</span>
    </span>
  )
}
