import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({

  server: {
    host: true,
    port: 5175,
    
    proxy: {
      '/backend': {
        target: 'http://localhost', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '/SMS-GCA-3H/Student/backend')
      },
    },
  },

  plugins: [react()],
});
