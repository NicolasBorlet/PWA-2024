import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from '@vitejs/plugin-react'

let faviconURL = '/favicon.svg'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: [faviconURL],
      manifest: {
        theme_color: '#ffffff',
        icons: [
          {
            src: faviconURL,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: faviconURL,
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      },
      injectRegister: 'auto',
    })
  ]
});
