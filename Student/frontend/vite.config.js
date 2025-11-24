import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    
    proxy: {
      '/backend': {
        target: 'http://localhost', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '/SMS-GCA-3D/Student/backend')
      },
    },
  },

  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});