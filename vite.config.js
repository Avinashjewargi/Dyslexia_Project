// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. Proxy all API requests
      '/api': {
        target: 'http://localhost:5000', 
        changeOrigin: true, 
        secure: false, 
      },
      // 2. CRITICAL FIX: Proxy all /audio requests 
      //    (This ensures the browser looks at port 5000 for static audio files)
      '/audio': { 
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
})