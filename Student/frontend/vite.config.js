import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    // This allows the ngrok URL to access your local server
    allowedHosts: true, 
    
    proxy: {
      '/backend': {
        target: 'http://localhost', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '/SMS-GCA-3H/Student/backend')
      },
      '/Student/backend': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      }
    },
  },

  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});