# Northwind Coffee Co. — Testability & Form States (v1)

**Author:** Cindy (Designer) · For: David (Test) + Bob (build).

> **Source-of-truth note:** David owns the **canonical `data-testid` registry** in `tests/` (his PR #2). The IDs below are my *proposed* hooks following his scheme `data-testid="<area>-<element>[-<variant>]"` — David, please fold/rename into your canonical list and I'll match. I own the **UX states** (what each happy/error state looks like); Bob implements; David asserts.

## Test-safe mode (agreed)
Bob exposes test mode via `NEXT_PUBLIC_TEST_MODE=1` or `?test=1`: forms POST to a mock handler — no real email/payment/analytics — returning **deterministic** success/error. Trigger the error path with a sentinel (proposed: card number `4000 0000 0000 0002` → declined; or `?test=fail`). David to confirm which sentinel he wires.

## Proposed `data-testid` hooks by area
**Nav/global**
`nav-link-shop`, `nav-link-subscriptions`, `nav-link-about`, `nav-cart-button`, `nav-cart-count`, `nav-search-button`, `nav-mobile-toggle`

**Shop**
`shop-filter-roast-<light|medium|dark>`, `shop-filter-origin-<slug>`, `shop-filter-grind-<slug>`, `shop-filter-clear`, `shop-grid`, `shop-empty`, `product-card-<slug>`, `product-card-add-<slug>`

**Product detail (PDP)**
`pdp-title`, `pdp-price`, `pdp-roast-badge`, `pdp-grind-select`, `pdp-qty-stepper`, `pdp-qty-input`, `pdp-add-to-cart`, `pdp-add-toast`

**Cart**
`cart-line-<slug>`, `cart-line-qty-<slug>`, `cart-line-remove-<slug>`, `cart-subtotal`, `cart-shipping`, `cart-total`, `cart-checkout-button`, `cart-empty`

**Checkout** (the critical form)
Fields: `checkout-email`, `checkout-name`, `checkout-address1`, `checkout-address2`, `checkout-city`, `checkout-region`, `checkout-postcode`, `checkout-country`, `checkout-phone`, `checkout-card-number`, `checkout-card-expiry`, `checkout-card-cvc`
Errors (one per field): `checkout-error-<field>` e.g. `checkout-error-email`
Summary/action: `checkout-summary-total`, `checkout-place-order`, `checkout-form-error` (form-level banner)

**Confirmation**
`confirm-banner`, `confirm-order-number`, `confirm-continue`

## Golden flow — happy path (David's e2e #1)
`/shop` → click `product-card-<slug>` → PDP → select grind → `pdp-add-to-cart` → assert `pdp-add-toast` + `nav-cart-count` = 1 → `nav-cart-button` → `/cart` → assert `cart-total` → `cart-checkout-button` → `/checkout` → fill all fields valid → `checkout-place-order` → `/checkout/success` → assert `confirm-banner` + `confirm-order-number` matches `NW-` pattern.

## Checkout form STATES (designer spec — implement & assert all four)
For EACH state, the visual + a11y behaviour is fixed:

1. **Empty submit** — click Place order with blank required fields:
   - Every required field shows inline error (`checkout-error-<field>`), red border, `aria-invalid="true"`, `aria-describedby` → error id.
   - Focus moves to first invalid field. Form-level banner `checkout-form-error` = "Please fix the highlighted fields." No navigation.
2. **Per-field validation** (on blur + on submit):
   - **email** invalid format → `checkout-error-email` "Enter a valid email."
   - **postcode** empty → "Postcode is required."
   - **card-number** wrong length/Luhn → "Enter a valid card number."
   - **expiry** in the past → "Card has expired."
   - **cvc** not 3–4 digits → "Enter the 3-digit code."
3. **Success** (valid + test mode) — `checkout-place-order` shows loading/disabled → navigates to `/checkout/success`; `confirm-banner` visible; cart cleared (`nav-cart-count` = 0).
4. **Server/declined error** (sentinel card or `?test=fail`) — no navigation; `checkout-form-error` banner = "Payment declined — please try another card." (role="alert"); fields retain values; button re-enabled.

## Add-to-cart STATES
- **Success**: toast `pdp-add-toast` (role="status") + badge increments.
- **Qty bounds**: stepper min 1; decrement at 1 is disabled, not negative.
- **Cart empty**: `/cart` with no items → `cart-empty` + Shop CTA (no checkout button).

## Filter STATES (Shop)
- **Match**: grid updates, count reflects, URL query set.
- **No match**: `shop-empty` shown, grid hidden, `shop-filter-clear` restores all.

## A11y test expectations (aligns with David's axe pass)
- axe: 0 serious/critical violations on every route.
- Keyboard-only: complete the golden flow with Tab/Enter/Space; visible focus throughout.
- Each form error programmatically associated (`aria-describedby`); form-level banners `role="alert"`.
- One `h1` per page; landmarks present.
- David runs axe at 2.1 AA stable ruleset + flags 2.2 gaps (agreed) — design targets 2.2 AA; no silent under-test.

## Open coordination
- David: confirm the **error sentinel** (declined card vs `?test=fail`) so Bob wires one mechanism.
- Bob: confirm Subscriptions "Start" stub behaviour (add-to-cart vs "coming soon" modal) — affects whether it needs test hooks now.
