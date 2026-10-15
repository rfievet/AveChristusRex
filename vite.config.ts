import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Host 0.0.0.0 so phones on the same wifi can reach the dev/preview server.
// Port 5317 is strict so it fails loudly instead of silently moving.
export default defineConfig({
  plugins: [
    react(),
    // Emits a service worker that precaches the built app for offline use.
    // manifest:false keeps public/manifest.webmanifest as the single source of
    // truth (the plugin only generates the SW). navigateFallback serves the SPA
    // shell for client-side routes. devOptions.enabled:false leaves the running
    // dev server on 5317 completely untouched.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false,
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
      },
      devOptions: { enabled: false },
    }),
  ],
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
