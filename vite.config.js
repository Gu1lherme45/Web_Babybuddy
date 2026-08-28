import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      // /login e /logout também são rotas do próprio SPA (páginas React);
      // só o POST (processamento real do Spring Security) deve ir pro
      // backend — GET precisa cair no index.html para o React Router
      '/login': {
        target: 'http://localhost:8080',
        bypass(req) {
          if (req.method === 'GET') return req.url;
        },
      },
      '/logout': {
        target: 'http://localhost:8080',
        bypass(req) {
          if (req.method === 'GET') return req.url;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js', './src/test/setup.js'],
    globals: true,
    exclude: ['e2e/**', 'node_modules/**'],
    fileParallelism: false,
    testTimeout: 20000,
  },
})
