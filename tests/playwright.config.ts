import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the ppz-four-agent-demo platform.
 *
 * BASE_URL is parameterized so the same suite runs against:
 *   - local dev    : http://localhost:3000  (default)
 *   - Vercel preview: BASE_URL=https://<deploy>.vercel.app npm test
 *   - CI            : injected per-environment
 *
 * No client URL is baked in — set WEBSITE_URL / BASE_URL once the real brief lands.
 */
const BASE_URL =
  process.env.BASE_URL || process.env.WEBSITE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['list']]
    : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
  /**
   * Auto-start the app for local runs. Disabled when TEST_AGAINST_DEPLOY=1
   * (e.g. testing a Vercel preview URL) since there's nothing to boot.
   * Points at the Next.js app dir Bob is scaffolding at repo root.
   */
  webServer: process.env.TEST_AGAINST_DEPLOY
    ? undefined
    : {
        command: 'npm run dev',
        cwd: '..',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
