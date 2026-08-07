import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served from the domain root (Netlify/Render). If you ever move back to
  // GitHub Pages at /Portfolio, this must become '/Portfolio/' or every
  // asset path 404s.
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // optional, keep if you need it
  },
})
