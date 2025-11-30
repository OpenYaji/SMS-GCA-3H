import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  server: {
    host: true,
    port: 5174,
    
    proxy: {
      '/backend': {
        target: 'http://localhost', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '/SMS-GCA-3H/Registrar/backend')
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@ui': resolve(__dirname, 'src/components/ui'),
      '@common': resolve(__dirname, 'src/components/common')
    }
  }
})