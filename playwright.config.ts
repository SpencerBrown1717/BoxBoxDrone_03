import { defineConfig } from '@playwright/test';

/**
 * Smoke tests for the site. They run against the production build.
 * Uses the installed Google Chrome, so no browser download is needed.
 */
export default defineConfig({
  testDir: 'tests',
  timeout: 45_000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    channel: 'chrome',
  },
  webServer: {
    command: 'npm run build && node scripts/serve-dist.mjs 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  ],
});
