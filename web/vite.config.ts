/**
 * Vite + React config.
 * Proxies API requests to the back-end running on port 4000.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  server: {
    port: 5173,
    proxy: {
      '/ping': 'http://localhost:4000',
      '/deals': 'http://localhost:4000'
    }
  },
  build: { outDir: 'dist-web' }
});
