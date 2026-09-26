import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base lets `dist/` run from any static file server (e.g. the
  // workspace preview) without a domain root; harmless for the dev proxy.
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    // BACKEND: Once django-cors-headers is enabled (or this proxy is used),
    // requests to /api/* and the other DRF routes forward to the Django dev
    // server started with `python manage.py runserver` from the circle/ folder.
    // NOTE: proxy keys must not collide with React Router paths (e.g. the
    // /saved page), so list API subpaths precisely: /saved/posts, not /saved.
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/auth': 'http://127.0.0.1:8000',
      '/posts': 'http://127.0.0.1:8000',
      '/user': 'http://127.0.0.1:8000',
      '/users': 'http://127.0.0.1:8000',
      '/following': 'http://127.0.0.1:8000',
      '/liked': 'http://127.0.0.1:8000',
      '/saved/posts': 'http://127.0.0.1:8000',
    },
  },
})
