# Northwind Coffee Co. — Form/UI States (designer annotations)

**Author:** Cindy (Designer) · For: David (Test) + Bob (build).

> **Canonical selectors live in David's `tests/TESTIDS.md` (v2 — matches the shipped app) — that file is the single source of truth for `data-testid`s.** I do **not** redefine IDs here. This doc supplies what David asked for: the **exact expected copy + behaviour** for every error / empty / success state, keyed to the canonical v2 testids, so Bob implements and David asserts identical strings. IDs below are synced to the as-built app (verified in design-QA of PR #4). Error sentinel agreed = **email `fail@test.com`** (forces declined). Test-safe mode = `NEXT_PUBLIC_TEST_MODE=1` / `?test=1`.

## Golden happy path (v2 ids, as built)
`/shop` → `product-card` (nth) → PDP → `pdp-grind-select` → `pdp-add-to-cart` → assert `pdp-add-toast` + `nav-cart-count`="1" → `nav-cart-button` → `/cart` → assert `cart-subtotal` → `cart-checkout-button` → `/checkout` → fill `checkout-email`/`checkout-name`/`checkout-address1`/`checkout-card-number`(+`-expiry`/`-cvc`) valid → `checkout-place-order` → `/checkout/success` → assert `confirm-banner` + `confirm-order-number` matches `/^NW-\d{4,}$/`.

## Checkout states — exact copy & behaviour

**Required fields (Option A):** email, name, address1, card-number, card-expiry, card-cvc (all inside `checkout-form`).

### State 1 — empty submit
Trigger: `checkout-place-order` with blank required fields.
- Each empty required field → `checkout-error-<field>` with copy:
  - `checkout-error-email`: **"Enter your email address."**
  - `checkout-error-name`: **"Enter your full name."**
  - `checkout-error-address1`: **"Enter your shipping address."**
  - `checkout-error-card-number`: **"Enter your card number."**
  - `checkout-error-card-expiry`: **"Enter the card expiry date."**
  - `checkout-error-card-cvc`: **"Enter the 3-digit security code."**
- Field gets red border, `aria-invalid="true"`, `aria-describedby` → its error id.
- `checkout-form-error` banner (role="alert"): **"Please fix the highlighted fields."**
- **No navigation.**

### State 2 — per-field format validation (on submit)
- Invalid email format → `checkout-error-email`: **"Enter a valid email address."**
- Card fails length (12–19 digits) → `checkout-error-card-number`: **"Enter a valid card number."**
- Expiry not MM/YY → `checkout-error-card-expiry`: **"Use MM/YY format."**; expiry in the past → **"Card has expired."**
- CVC not 3–4 digits → `checkout-error-card-cvc`: **"Enter the 3-digit security code."**

### State 3 — success (valid + test mode)
- `checkout-place-order` → loading/disabled ("Placing order…") during submit.
- Navigate to `/checkout/success`; `confirm-banner` visible with heading **"Thank you — your order is confirmed."**
- `confirm-order-number`: **"NW-####"**; note text **"We've emailed your receipt."** (mocked in test mode).
- Cart cleared → `nav-cart-count` = "0".

### State 4 — declined / server error (sentinel `fail@test.com`)
- **No navigation.** `checkout-form-error` (role="alert"): **"Payment declined — please try another card."**
- Fields retain their values; `checkout-place-order` re-enabled. Cart unchanged.

## Add-to-cart states
- **Success:** `pdp-add-toast` (role="status") copy **"Added to your cart."** + `nav-cart-count` increments.
- **Qty bounds:** `pdp-qty-input` min 1; decrement disabled at 1 (never 0/negative).

## Cart states
- **Empty:** `/cart` with no items → `cart-empty` copy **"Your cart is empty."** + "Shop coffee" CTA; no `cart-checkout-button`.
- **Populated:** each `cart-line` shows name/qty/line-price; `cart-subtotal` updates on qty change; free shipping over $40 (else $5) — show in summary.

## Shop filter states
- **Match:** `shop-grid` updates, count reflects, URL query set (`?roast=dark`).
- **No match:** `shop-empty` copy **"No coffees match your filters."** + a clear-filters action; `shop-grid` hidden.

## 404
- `not-found` marker present; copy **"This page got lost on the way to the roastery."** + Home + Shop CTAs.

## A11y assertions (aligns with David's axe pass)
- axe: 0 serious/critical on every route.
- Keyboard-only completion of the golden flow; visible amber focus ring throughout.
- Every `checkout-error-<field>` programmatically tied to its input (`aria-describedby`); summary banners `role="alert"`.
- One `h1` per page; `footer` + `main`/`nav` landmarks present.

## Reconciliation notes (resolved)
- The as-built app uses **granular** checkout field ids (`checkout-address1`, `checkout-card-number/-expiry/-cvc`) with per-field errors `checkout-error-<field>`. David's v2 `tests/TESTIDS.md` was aligned to these exact ids — app and contract match (Bob's 9/9 e2e green confirms). My earlier draft cited the older single-anchor names (`checkout-address`/`checkout-card`); those are superseded — **use the v2 ids above**.
- If any element in the contract doesn't exist in the design, ping me and we amend the contract together (not guess).
