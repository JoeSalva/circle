/**
 * Login / "Join the Circle" screen (login_screen0.png).
 *
 * BACKEND mapping:
 *   - "Join the Circle" form  -> POST /auth/signup/  (SignUpSerializer takes
 *     { username, password }; the design's Full Name / Email fields have no
 *     backend columns, so we map Full Name -> username and note Email as
 *     UI-only until the serializer gains it).
 *   - "Log in" link           -> POST /api/token/  (JWT obtain pair)
 *   - Google / Apple buttons  -> UI-only; the API has no OAuth endpoints.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Moon, Sun } from 'lucide-react'

/** Feature blurbs under the fold — static marketing copy, UI-only. */
const FEATURES = [
  {
    icon: '☕',
    title: 'Small Moments',
    text: 'Share your morning brew, a favorite read, or the golden light on your desk.',
  },
  {
    icon: '👥',
    title: 'Genuine Connection',
    text: 'Find people who cherish the same quiet joys and meaningful conversations.',
  },
  {
    icon: '✨',
    title: 'Personal Scrapbook',
    text: 'Collect memories, not just things. A digital space that feels like home.',
  },
]

export default function Login() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dark, setDark] = useState(false) // decorative toggle in the design

  const join = (e: React.FormEvent) => {
    e.preventDefault()
    // BACKEND (commented): POST /auth/signup/ then POST /api/token/
    //   await signUp({ username: fullName.trim().replace(/\s+/g, '').toLowerCase(), password })
    //   await login({ username, password })
    //   navigate('/')
    navigate('/') // mocked: go straight into the feed
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="flex h-20 items-center gap-10 px-10">
        <Link to="/" className="font-display text-3xl font-bold italic text-ink">
          Gather
        </Link>
        <nav className="hidden gap-8 text-[15px] font-medium text-ink-soft md:flex">
          <a href="#" className="transition hover:text-ink">About</a>
          <a href="#" className="transition hover:text-ink">Community</a>
          <a href="#" className="transition hover:text-ink">Support</a>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {/* Dark mode — UI-only toggle (no themed styles shipped yet). */}
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-white"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/* "Log in" -> BACKEND: POST /api/token/ (see lib/api.ts#login).
              Routed to the same screen for now; a dedicated login variant
              would hide the Full Name field. */}
          <a href="#join" className="text-[15px] font-medium text-ink transition hover:text-gather">
            Log in
          </a>
          <a
            href="#join"
            className="btn-gather h-11 px-5 text-sm shadow-pill"
          >
            Join the Circle
          </a>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[1.15fr_1fr]">
        {/* Left hero panel — photography would come from static assets or a
            CDN; UI-only (the API has no media endpoints for hero images). */}
        <section className="relative flex items-end overflow-hidden bg-[linear-gradient(160deg,#e8b98a_0%,#d69a63_40%,#8a5a35_100%)] p-12">
          {/* soft sun glow */}
          <div className="absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,236,200,0.85)_0%,transparent_65%)]" />
          {/* suggested friends silhouette strip */}
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-[62%] items-end gap-4 opacity-45 mix-blend-luminosity">
            {['#3f3a37', '#efe6da', '#5a4a3f', '#2f2b28'].map((c, i) => (
              <div key={i} className="h-28 w-20 rounded-t-full" style={{ background: c, height: `${88 + i * 18}px` }} />
            ))}
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur">
              ☀ Morning Glow
            </span>
            <h1 className="mt-6 max-w-xl font-display text-6xl leading-[1.05] font-bold text-white">
              Start your day with warmth &amp; connection.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
              Join a cozy community where every interaction feels like a hug. Share moments, find comfort, and grow together.
            </p>
          </div>
        </section>

        {/* Right form panel */}
        <section id="join" className="flex items-center justify-center px-6 py-16 lg:px-14">
          <div className="w-full max-w-md">
            <h2 className="font-display text-4xl font-bold text-ink">Welcome to the Circle</h2>
            <p className="mt-3 text-[15px] text-ink-soft">Find your place in our growing community.</p>

            {/* Social sign-in — UI-only; the API exposes no OAuth routes. */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button type="button" className="flex h-12 items-center justify-center gap-2 rounded-full border border-hairline bg-white text-[15px] font-medium text-ink transition hover:border-gather/40">
                <span aria-hidden>🇬</span> Google
              </button>
              <button type="button" className="flex h-12 items-center justify-center gap-2 rounded-full border border-hairline bg-white text-[15px] font-medium text-ink transition hover:border-gather/40">
                 Apple
              </button>
            </div>

            <div className="my-7 flex items-center gap-4 text-xs tracking-[0.2em] text-ink-faint uppercase">
              <span className="h-px flex-1 bg-hairline" />
              or join with email
              <span className="h-px flex-1 bg-hairline" />
            </div>

            <form onSubmit={join} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-xs font-semibold tracking-wider text-ink uppercase">
                  Full Name
                </label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Emily Sunny"
                  className="h-13 w-full rounded-2xl border border-hairline bg-parchment px-5 text-[15px] outline-none placeholder:text-ink-faint focus:border-gather/50"
                />
                {/* BACKEND NOTE: mapped to SignUpSerializer.username
                    (User model has no first/last name usage in the API). */}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-semibold tracking-wider text-ink uppercase">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emily@example.com"
                  className="h-13 w-full rounded-2xl border border-hairline bg-parchment px-5 text-[15px] outline-none placeholder:text-ink-faint focus:border-gather/50"
                />
                {/* BACKEND NOTE: User model/serializer has no email field —
                    UI-only until SignUpSerializer adds it. */}
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-xs font-semibold tracking-wider text-ink uppercase">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-13 w-full rounded-2xl border border-hairline bg-parchment px-5 text-[15px] outline-none placeholder:text-ink-faint focus:border-gather/50"
                />
              </div>

              <button type="submit" className="btn-gather h-14 w-full rounded-full text-[15px] shadow-pill">
                Join the Circle <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-6 text-center text-[15px] text-ink">
              I already have an account.{' '}
              {/* BACKEND: POST /api/token/ for JWTs (lib/api.ts#login). */}
              <a href="#join" className="font-medium text-gather hover:underline">Log in</a>
            </p>

            <p className="mt-10 text-center text-xs text-ink-faint">
              By joining, you agree to our <a href="#" className="underline hover:text-ink-soft">Terms of Service</a> and{' '}
              <a href="#" className="underline hover:text-ink-soft">Privacy Policy.</a>
            </p>
          </div>
        </section>
      </div>

      {/* Feature blurbs */}
      <section className="grid gap-12 bg-cream px-10 py-16 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-card">
              {f.icon}
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-ink">{f.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
