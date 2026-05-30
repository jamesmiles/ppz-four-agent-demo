import { test, expect, Page } from '@playwright/test';

/**
 * GOLDEN PATH — the revenue flow for Northwind Coffee Co.
 *   browse (/shop) → product detail → add to cart → cart → checkout → confirmation
 * Plus one checkout ERROR path.
 *
 * Selectors come from tests/TESTIDS.md (the contract Bob builds to).
 *
 * Guard: until the app exists, /shop 404s — these tests SKIP (not fail) so the
 * harness stays green on main. They auto-activate the moment Bob's routes land.
 * Force-run against a deploy:  BASE_URL=https://<preview> npm test shop-golden
 *
 * Test-safe submit: relies on NEXT_PUBLIC_TEST_MODE=1 (Bob) so checkout fires no
 * real payment/email and returns deterministic success/error.
 */

const id = (testId: string) => `[data-testid="${testId}"]`;

// Skip the whole file if the shop route isn't up yet.
test.beforeEach(async ({ page }) => {
  const res = await page.goto('/shop').catch(() => null);
  test.skip(
    !res || res.status() >= 400,
    'Northwind /shop not available yet — app not scaffolded. Skipping until routes land.',
  );
});

async function addFirstProductToCart(page: Page) {
  await expect(page.locator(id('shop-grid'))).toBeVisible();
  const firstCard = page.locator(id('shop-card')).first();
  await expect(firstCard).toBeVisible();
  const productName = (await firstCard.locator(id('shop-card-name')).innerText()).trim();

  await firstCard.locator(id('shop-card-link')).click();

  // PDP
  await expect(page.locator(id('pdp-name'))).toContainText(productName);
  await page.locator(id('pdp-add-to-cart')).click();
  await expect(page.locator(id('pdp-added-toast'))).toBeVisible();

  return productName;
}

test.describe('golden path: browse → cart → checkout', () => {
  test('happy path: add to cart and complete checkout', async ({ page }) => {
    const productName = await addFirstProductToCart(page);

    // Cart badge reflects the add
    await expect(page.locator(id('nav-cart-count'))).toHaveText(/[1-9]/);

    // Go to cart, verify the line item
    await page.locator(id('nav-cart')).click();
    await expect(page.locator(id('cart-line-name')).first()).toContainText(productName);
    await expect(page.locator(id('cart-subtotal'))).toBeVisible();

    // Proceed to checkout
    await page.locator(id('cart-checkout-cta')).click();
    await expect(page.locator(id('checkout-form'))).toBeVisible();

    // Fill the form (test-safe mode → no real payment/email)
    await page.locator(id('checkout-email')).fill('shopper@test.com');
    await page.locator(id('checkout-name')).fill('Test Shopper');
    await page.locator(id('checkout-address')).fill('1 Roastery Way, Beanton');
    await page.locator(id('checkout-card')).fill('4242424242424242');
    await page.locator(id('checkout-submit')).click();

    // Confirmation
    await expect(page).toHaveURL(/\/checkout\/success/);
    await expect(page.locator(id('confirmation-heading'))).toBeVisible();
    await expect(page.locator(id('confirmation-order-id'))).not.toBeEmpty();
  });

  test('validation: empty checkout submit shows field errors', async ({ page }) => {
    await addFirstProductToCart(page);
    await page.locator(id('nav-cart')).click();
    await page.locator(id('cart-checkout-cta')).click();
    await expect(page.locator(id('checkout-form'))).toBeVisible();

    // Submit empty → expect an error summary and at least the email field error
    await page.locator(id('checkout-submit')).click();
    await expect(page.locator(id('checkout-error-summary'))).toBeVisible();
    await expect(page.locator(id('checkout-error-email'))).toBeVisible();
    // Must NOT have navigated to success
    await expect(page).not.toHaveURL(/\/checkout\/success/);
  });

  test('error path: declined payment surfaces an error (sentinel email)', async ({ page }) => {
    await addFirstProductToCart(page);
    await page.locator(id('nav-cart')).click();
    await page.locator(id('cart-checkout-cta')).click();

    // Sentinel email forces the mock handler to return a decline (confirm value w/ Bob)
    await page.locator(id('checkout-email')).fill('fail@test.com');
    await page.locator(id('checkout-name')).fill('Test Shopper');
    await page.locator(id('checkout-address')).fill('1 Roastery Way, Beanton');
    await page.locator(id('checkout-card')).fill('4000000000000002');
    await page.locator(id('checkout-submit')).click();

    await expect(page.locator(id('checkout-error-summary'))).toBeVisible();
    await expect(page).not.toHaveURL(/\/checkout\/success/);
  });
});
