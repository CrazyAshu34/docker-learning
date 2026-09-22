import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Essential for Docker container access
    port: 5174,
    strictPort: true,
    watch: {
      usePolling: true // Enables hot reload inside Docker on Windows/WSL
    }
  }
});
