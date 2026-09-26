import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import HomeFeed from './pages/HomeFeed'
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import Explore from './pages/Explore'
import Saved from './pages/Saved'
import Connections from './pages/Connections'

export default function App() {
  return (
    <Routes>
      {/* `/login` doubles as signup: the design's "Join the Circle" form maps to
          BACKEND: POST /auth/signup/ then POST /api/token/ (see pages/Login.tsx). */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomeFeed />} />
      <Route path="/post/:postId" element={<PostDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/connections" element={<Connections />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
