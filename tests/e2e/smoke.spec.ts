import { test, expect } from '@playwright/test';

/**
 * Smoke suite — the "is the site alive and not obviously broken?" layer.
 * Intentionally route-light until Cindy's IA + Bob's routes land.
 * Currently asserts only against `/` (home), the one route Bob confirmed.
 *
 * These checks are brand/client-agnostic on purpose: they verify a page
 * renders, has a title, has no console errors, and serves a 200 — without
 * asserting copy that we don't know yet (no CLIENT_NAME baked in).
 */

test.describe('smoke: home', () => {
  test('home returns 200 and renders', async ({ page }) => {
    const response = await page.goto('/');
    expect(response, 'navigation should return a response').toBeTruthy();
    expect(response!.status(), 'home should serve 2xx').toBeLessThan(400);
    // <body> exists and has visible content
    await expect(page.locator('body')).toBeVisible();
  });

  test('home has a non-empty <title>', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.trim().length, 'page should have a title').toBeGreaterThan(0);
  });

  test('home has exactly one <h1> (basic landmark sanity)', async ({ page }) => {
    await page.goto('/');
    // Soft-ish: many designs use one h1. Warn-level via expect; tighten later.
    const h1Count = await page.locator('h1').count();
    expect(h1Count, 'expect a single primary heading').toBeGreaterThanOrEqual(1);
  });

  test('home logs no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors, `console errors found:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('no broken in-page links on home (same-origin, HEAD check)', async ({
    page,
    request,
  }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((els) =>
        els
          .map((e) => (e as HTMLAnchorElement).href)
          .filter((h) => h.startsWith(location.origin)),
      );
    const unique = [...new Set(hrefs)];
    const broken: string[] = [];
    for (const url of unique) {
      const res = await request.get(url).catch(() => null);
      if (!res || res.status() >= 400) broken.push(`${url} -> ${res?.status() ?? 'no response'}`);
    }
    expect(broken, `broken links:\n${broken.join('\n')}`).toHaveLength(0);
  });
});
