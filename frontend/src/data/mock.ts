/**
 * Mock data mirroring the Circle DRF serializers 1:1, so real API responses
 * can replace these objects without touching component code.
 *
 * Fields come straight from:
 *   - PostSerializer        (circle/api/serializers.py)
 *   - UserProfileSerializer / PrivateProfileSerializer (circle/user_profile/serializers.py)
 *   - CommentSerializer     (circle/interactions/serializers.py)
 *
 * Stories, circles, and warmth stats have no backend counterpart yet — they
 * are UI-only mocks (marked below).
 */

export interface Author {
  id: number
  username: string
}

/** PostSerializer shape (list feed). */
export interface Post {
  post_id: string // UUIDField
  post: string // body text; designs render the first line as the title
  image: string | null // ImageField URL (mocks use gradient placeholders)
  user: Author
  total_comments: number
  is_liked: boolean
  total_likes: number
  is_saved: boolean
  visibility: 'public' | 'private'
  post_url: string
  created_at: string // ISO datetime
  total_saves?: number // SinglePostSerializer only (detail view)
}

/** PrivateProfileSerializer shape (GET /user/me/profile/). */
export interface Profile {
  username: string
  desc: string | null
  location: string | null
  total_posts: number
  followers: number
  following: number
  posts_url: string
}

/** CommentSerializer shape. */
export interface Comment {
  id: number
  user: string // username (CommentSerializer exposes user as a string)
  comment: string
  image: string | null
  created_at: string
  updated_at: string
}

/** UserSerializer shape (GET /user/me/followers/ + /user/me/following/). */
export interface PersonCard {
  id: number
  username: string
  description: string | null
  user_follows?: boolean // extra field from UserProfileSerializer (Explore)
}

/** Explore-page card: UserProfileSerializer minus computed URL fields. */
export interface ExploreProfile {
  id: number
  username: string
  desc: string | null
  location: string | null
  total_posts: number
  followers: number
  following: number
  user_follows: boolean
  follows_user: boolean
}

// -- UI-only data (no backend endpoints exist for these) ---------------------

export interface Story {
  id: number
  label: string
  gradient: string
}

export interface Circle {
  id: number
  name: string
  members: string
  gradient: string
  emoji: string
}

export interface Moment {
  id: number
  kind: 'image' | 'quote' | 'caption'
  gradient?: string
  text?: string
  tall?: boolean
}

export const currentUserId = 1
export const currentUser: Author & { avatarGradient: string; initials: string } = {
  id: 1,
  username: 'emilysunny',
  avatarGradient: 'linear-gradient(135deg, #FDBA74, #F97316)',
  initials: 'ES',
}

export const mockProfile: Profile = {
  username: 'Emily Sunny',
  desc: 'Coffee lover & sunset chaser ☀️',
  location: 'New York, NY',
  total_posts: 32,
  followers: 150,
  following: 240,
  posts_url: '/user/1/posts/',
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

export const mockPosts: Post[] = [
  {
    post_id: 'a1b2c3d4-0001-4a1b-9c2d-000000000001',
    post: 'Sunday Morning Reads',
    image: null, // rendered as the "SUN□ MORNING READS" editorial placeholder card
    user: { id: 2, username: 'Elara Vance' },
    total_comments: 45,
    is_liked: true,
    total_likes: 1200,
    is_saved: false,
    visibility: 'public',
    post_url: '/posts/a1b2c3d4-0001-4a1b-9c2d-000000000001',
    created_at: minutesAgo(120),
  },
  {
    post_id: 'a1b2c3d4-0002-4a1b-9c2d-000000000002',
    post: 'Autumn Walk',
    image: null, // rendered as the warm autumn-tree gradient illustration
    user: { id: 3, username: 'James Miller' },
    total_comments: 23,
    is_liked: false,
    total_likes: 856,
    is_saved: true,
    visibility: 'public',
    post_url: '/posts/a1b2c3d4-0002-4a1b-9c2d-000000000002',
    created_at: minutesAgo(300),
  },
]

export const mockComments: Comment[] = [
  {
    id: 1,
    user: 'Coco Chen',
    comment: 'This is the exact energy I needed today ☕',
    image: null,
    created_at: minutesAgo(45),
    updated_at: minutesAgo(45),
  },
  {
    id: 2,
    user: 'David Osei',
    comment: 'The light in this one… perfect morning.',
    image: null,
    created_at: minutesAgo(80),
    updated_at: minutesAgo(80),
  },
  {
    id: 3,
    user: 'Anna Kova',
    comment: 'Saving this for my own slow Sunday ☀️',
    image: null,
    created_at: minutesAgo(95),
    updated_at: minutesAgo(95),
  },
  {
    id: 4,
    user: 'Ben Ortiz',
    comment: 'That stack of books is a whole mood.',
    image: null,
    created_at: minutesAgo(110),
    updated_at: minutesAgo(110),
  },
]

/** Stand-in for GET /posts/<post_id>/comments until the API is wired. */
export function mockCommentsByPost(postId: string): Comment[] {
  if (postId.endsWith('0002')) {
    return [
      {
        id: 5,
        user: 'Elena Brook',
        comment: 'Golden hour hits different 🍂',
        image: null,
        created_at: minutesAgo(30),
        updated_at: minutesAgo(30),
      },
      {
        id: 6,
        user: 'David Osei',
        comment: 'The crunch of leaves is underrated.',
        image: null,
        created_at: minutesAgo(70),
        updated_at: minutesAgo(70),
      },
    ]
  }
  return mockComments
}

export const mockStories: Story[] = [
  { id: 1, label: 'My Story', gradient: 'linear-gradient(135deg, #FDBA74, #F97316)' },
  { id: 2, label: 'Anna', gradient: 'linear-gradient(135deg, #F9A8D4, #EC4899)' },
  { id: 3, label: 'Ben', gradient: 'linear-gradient(135deg, #93C5FD, #3B82F6)' },
  { id: 4, label: 'Coco', gradient: 'linear-gradient(135deg, #FCD34D, #F59E0B)' },
  { id: 5, label: 'David', gradient: 'linear-gradient(135deg, #A3A3A3, #525252)' },
  { id: 6, label: 'Elena', gradient: 'linear-gradient(135deg, #FDBA74, #EA580C)' },
]

export const mockCircles: Circle[] = [
  { id: 1, name: 'Early Birds', members: '1.2k members', gradient: 'linear-gradient(135deg, #FDBA74, #F59E0B)', emoji: '☕' },
  { id: 2, name: 'Nature Therapy', members: '890 members', gradient: 'linear-gradient(135deg, #86EFAC, #10B981)', emoji: '🌲' },
  { id: 3, name: 'Quiet Readers', members: '2.1k members', gradient: 'linear-gradient(135deg, #93C5FD, #3B82F6)', emoji: '📖' },
]

export const mockMoments: Moment[] = [
  { id: 1, kind: 'image', gradient: 'linear-gradient(180deg, #F7B267 0%, #F4845F 35%, #2E4057 100%)', tall: false },
  { id: 2, kind: 'image', gradient: 'linear-gradient(135deg, #EAD8C3, #D9BFA3)' },
  { id: 3, kind: 'quote', text: '"Collect moments, not things."' },
  { id: 4, kind: 'caption', text: 'Cozy vibes only ✨', gradient: 'linear-gradient(135deg, #F5E6D3, #EAD8C3)' },
  { id: 5, kind: 'image', gradient: 'linear-gradient(180deg, #FFF7ED 0%, #FFEDD5 55%, #14B8A6 100%)', tall: true },
  { id: 6, kind: 'image', gradient: 'linear-gradient(180deg, #FDBA74 0%, #F97316 45%, #1E3A5F 100%)' },
  { id: 7, kind: 'image', gradient: 'linear-gradient(180deg, #C7D2A9 0%, #8A9A5B 100%)', tall: true },
  { id: 8, kind: 'image', gradient: 'linear-gradient(180deg, #F3E5D8 0%, #DDBEA9 100%)', tall: true },
]

export const mockHighlights: Story[] = [
  { id: 11, label: 'New Story', gradient: 'linear-gradient(135deg, #FDBA74, #F97316)' },
  { id: 12, label: 'Reads', gradient: 'linear-gradient(135deg, #EAD8C3, #CBB9A0)' },
  { id: 13, label: 'Brews', gradient: 'linear-gradient(135deg, #CBD5E1, #64748B)' },
  { id: 14, label: 'Fall', gradient: 'linear-gradient(135deg, #FB923C, #C2410C)' },
  { id: 15, label: 'Nap Time', gradient: 'linear-gradient(135deg, #FDE68A, #F59E0B)' },
]

// -- People / connections (Explore + Connections pages) ----------------------

export const mockPeople: ExploreProfile[] = [
  {
    id: 2,
    username: 'Elara Vance',
    desc: 'Sunday reader & leaf collector 📚',
    location: 'Portland, OR',
    total_posts: 48,
    followers: 890,
    following: 120,
    user_follows: false,
    follows_user: true,
  },
  {
    id: 3,
    username: 'James Miller',
    desc: 'Autumn walks, strong coffee ☕',
    location: 'Austin, TX',
    total_posts: 21,
    followers: 430,
    following: 310,
    user_follows: true,
    follows_user: false,
  },
  {
    id: 4,
    username: 'Coco Chen',
    desc: 'Interiors & golden light ✨',
    location: 'San Diego, CA',
    total_posts: 63,
    followers: 2100,
    following: 95,
    user_follows: false,
    follows_user: false,
  },
  {
    id: 5,
    username: 'David Osei',
    desc: 'Quiet mornings, loud thoughts 🌱',
    location: 'Chicago, IL',
    total_posts: 12,
    followers: 210,
    following: 480,
    user_follows: false,
    follows_user: false,
  },
  {
    id: 6,
    username: 'Elena Brook',
    desc: 'Trail runner & tea drinker 🍵',
    location: 'Seattle, WA',
    total_posts: 37,
    followers: 1540,
    following: 260,
    user_follows: true,
    follows_user: true,
  },
]

/** GET /user/me/followers/ mock — UserSerializer shape. */
export const mockFollowers: PersonCard[] = [
  { id: 2, username: 'Elara Vance', description: 'Sunday reader & leaf collector 📚', user_follows: true },
  { id: 6, username: 'Elena Brook', description: 'Trail runner & tea drinker 🍵', user_follows: true },
  { id: 5, username: 'David Osei', description: 'Quiet mornings, loud thoughts 🌱', user_follows: false },
]

/** GET /user/me/following/ mock — UserSerializer shape. */
export const mockFollowing: PersonCard[] = [
  { id: 3, username: 'James Miller', description: 'Autumn walks, strong coffee ☕', user_follows: true },
  { id: 6, username: 'Elena Brook', description: 'Trail runner & tea drinker 🍵', user_follows: true },
]
