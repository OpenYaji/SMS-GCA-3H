import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    server: {
    host: true,
    port: 5176,
    
    proxy: {
      '/backend': {
        target: 'http://localhost', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '/SMS-GCA-3H/Student/backend')
      },
    },
  },
  plugins: [react(), tailwindcss(),],
  server: {
    host: true
  }
})
