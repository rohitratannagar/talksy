import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // or '0.0.0.0' to expose to local network
  },
  plugins: [react()],
})
