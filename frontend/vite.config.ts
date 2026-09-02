// Import defineConfig helper from Vite for typed configuration
import { defineConfig } from 'vite';
// Import official Vite React plugin for Fast Refresh and JSX transformation
import react from '@vitejs/plugin-react';
// Import Node.js path module for filesystem path resolutions
import path from 'path';

// Vite configuration definition
export default defineConfig({
  // Project root directory resolved to the folder containing this config file
  root: path.resolve(__dirname),
  // Register React plugin to enable JSX/TSX support and HMR
  plugins: [react()],
  resolve: {
    // Path alias configuration for cleaner import paths across the frontend codebase
    alias: {
      // Maps '@/...' to the './src/...' folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Destination directory where production build output bundle is generated
    outDir: 'dist',
  },
  server: {
    // Local development HTTP server port
    port: 5173,
    // Development proxy settings to route API calls directly to the backend
    proxy: {
      // Forward all /api requests to local Express backend running on port 3000
      '/api': {
        target: 'http://localhost:3000',
        // Update host header origin to target URL for CORS compatibility during dev
        changeOrigin: true,
      },
    },
  },
});

