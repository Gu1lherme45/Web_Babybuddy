import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const createProxyConfig = () => ({
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
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: createProxyConfig(),
  },
  preview: {
    proxy: createProxyConfig(),
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      },
    },
    globals: true,
    exclude: ['e2e/**', 'node_modules/**'],
    fileParallelism: false,
    testTimeout: 20000,
  },
})
