import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility layer — runs axe-core against key routes.
 * Starts with `/`; add routes as the IA grows.
 * Fails on WCAG 2.1 A/AA violations so a11y regressions are caught early
 * rather than retrofitted at the end.
 */

const ROUTES = ['/'];

for (const route of ROUTES) {
  test(`a11y: ${route} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
    }));

    expect(
      results.violations,
      `a11y violations on ${route}:\n${JSON.stringify(violations, null, 2)}`,
    ).toEqual([]);
  });
}
