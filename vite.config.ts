import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',   // must match your GitHub repo name
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // optional, keep if you need it
  },
})
