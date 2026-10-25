import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Bind to localhost only (never expose on all interfaces).
export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5173 },
})
