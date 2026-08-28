import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // os specs escrevem no mesmo backend/banco real compartilhado (sem
  // isolamento por teste), então rodam em série para não competir entre si
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
