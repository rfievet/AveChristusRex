import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Host 0.0.0.0 so phones on the same wifi can reach the dev/preview server.
// Port 5317 is strict so it fails loudly instead of silently moving.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5317,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5317,
    strictPort: true,
  },
})
