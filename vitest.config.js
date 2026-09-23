import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
    restoreMocks: true,
  },
});
