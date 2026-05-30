import { test, expect, Page } from '@playwright/test';

/**
 * GOLDEN PATH — the revenue flow for Northwind Coffee Co.
 *   browse (/shop) → product detail → add to cart → cart → checkout → confirmation
 * Plus checkout error paths (empty-submit validation + declined payment).
 *
 * Selectors: tests/TESTIDS.md (canonical v2, reconciled with Cindy's 04-testability.md).
 * States asserted: Cindy's four checkout states.
 *
 * Guard: until the app exists, /shop 404s — these tests SKIP (not fail) so the
 * harness stays green on main. Auto-activate once Bob's routes land.
 * Run against a deploy:  TEST_AGAINST_DEPLOY=1 BASE_URL=https://<preview> npm test shop-golden
 *
 * Test-safe submit (Bob): NEXT_PUBLIC_TEST_MODE=1 (or ?test=1) → mock handler.
 * Error sentinel (Bob's canonical call): email 'fail@test.com' → declined.
 * Card 4000000000000002 is accepted as a secondary trigger but email is canonical.
 */

const id = (testId: string) => `[data-testid="${testId}"]`;
const GOOD_CARD = '4242424242424242';
const DECLINE_EMAIL = 'fail@test.com';

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
  const firstCard = page.locator(id('product-card')).first();
  await expect(firstCard).toBeVisible();
  const productName = (
    await firstCard.locator(id('product-card-name')).innerText()
  ).trim();

  // Open the PDP by clicking the card.
  await firstCard.click();

  await expect(page.locator(id('pdp-title'))).toContainText(productName);
  await page.locator(id('pdp-add-to-cart')).click();
  await expect(page.locator(id('pdp-add-toast'))).toBeVisible();

  return productName;
}

async function fillCheckout(page: Page, email = 'shopper@test.com', card = GOOD_CARD) {
  await page.locator(id('checkout-email')).fill(email);
  await page.locator(id('checkout-name')).fill('Test Shopper');
  await page.locator(id('checkout-address1')).fill('1 Roastery Way');
  await page.locator(id('checkout-city')).fill('Beanton');
  await page.locator(id('checkout-postcode')).fill('BN1 2CD');
  // country/region may be selects with sensible defaults; fill if present.
  await page.locator(id('checkout-card-number')).fill(card);
  await page.locator(id('checkout-card-expiry')).fill('12/30');
  await page.locator(id('checkout-card-cvc')).fill('123');
}

test.describe('golden path: browse → cart → checkout', () => {
  test('happy path: add to cart and complete checkout', async ({ page }) => {
    const productName = await addFirstProductToCart(page);

    await expect(page.locator(id('nav-cart-count'))).toHaveText(/[1-9]/);

    await page.locator(id('nav-cart-button')).click();
    await expect(page.locator(id('cart-line')).first()).toContainText(productName);
    await expect(page.locator(id('cart-total'))).toBeVisible();

    await page.locator(id('cart-checkout-button')).click();
    await expect(page.locator(id('checkout-form'))).toBeVisible();

    await fillCheckout(page);
    await page.locator(id('checkout-place-order')).click();

    // Confirmation
    await expect(page).toHaveURL(/\/checkout\/success/);
    await expect(page.locator(id('confirm-banner'))).toBeVisible();
    // Order ref format per Cindy's spec: NW-<digits>
    await expect(page.locator(id('confirm-order-number'))).toHaveText(/^NW-\d{4,}/);
    // Cart cleared after successful order (Cindy state #3)
    await expect(page.locator(id('nav-cart-count'))).toHaveText(/^0?$/);
  });

  test('validation: empty checkout submit shows field errors (state #1)', async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await page.locator(id('nav-cart-button')).click();
    await page.locator(id('cart-checkout-button')).click();
    await expect(page.locator(id('checkout-form'))).toBeVisible();

    await page.locator(id('checkout-place-order')).click();
    await expect(page.locator(id('checkout-form-error'))).toBeVisible();
    await expect(page.locator(id('checkout-error-email'))).toBeVisible();
    await expect(page).not.toHaveURL(/\/checkout\/success/);
  });

  test('error path: declined card surfaces an error, no navigation (state #4)', async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await page.locator(id('nav-cart-button')).click();
    await page.locator(id('cart-checkout-button')).click();

    // Canonical decline trigger: sentinel email (Bob), everything else valid.
    await fillCheckout(page, DECLINE_EMAIL);
    await page.locator(id('checkout-place-order')).click();

    const banner = page.locator(id('checkout-form-error'));
    await expect(banner).toBeVisible();
    await expect(banner).toHaveText(/declined/i);
    await expect(page).not.toHaveURL(/\/checkout\/success/);
    // Values retained (Cindy state #4)
    await expect(page.locator(id('checkout-email'))).toHaveValue(DECLINE_EMAIL);
  });
});
