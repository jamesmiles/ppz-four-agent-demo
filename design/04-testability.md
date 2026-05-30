# Northwind Coffee Co. — Form/UI States (designer annotations)

**Author:** Cindy (Designer) · For: David (Test) + Bob (build).

> **Canonical selectors live in David's `tests/TESTIDS.md` (PR #2) — that file is the single source of truth for `data-testid`s.** I do **not** redefine IDs here. This doc supplies what David asked for: the **exact expected copy + behaviour** for every error / empty / success state, keyed to his canonical testids, so Bob implements and David asserts identical strings. Error sentinel agreed = **email `fail@test.com`** (forces declined). Test-safe mode = `NEXT_PUBLIC_TEST_MODE=1` / `?test=1`.

## Golden happy path (maps to David's ids)
`/shop` → `shop-card-link` (nth) → PDP → `pdp-grind-select` → `pdp-add-to-cart` → assert `pdp-added-toast` + `nav-cart-count`="1" → `nav-cart` → `/cart` → assert `cart-subtotal` → `cart-checkout-cta` → `/checkout` → fill `checkout-email`/`checkout-name`/`checkout-address`/`checkout-card` valid → `checkout-submit` → `/checkout/success` → assert `confirmation-heading` + `confirmation-order-id` matches `/^NW-\d{4,}$/`.

## Checkout states — exact copy & behaviour

**Required fields:** email, name, address, card (all present in `checkout-form`).

### State 1 — empty submit
Trigger: `checkout-submit` with blank required fields.
- Each empty required field → `checkout-error-<field>` with copy:
  - `checkout-error-email`: **"Enter your email address."**
  - `checkout-error-name`: **"Enter your full name."**
  - `checkout-error-address`: **"Enter your shipping address."**
  - `checkout-error-card`: **"Enter your card number."**
- Field gets red border, `aria-invalid="true"`, `aria-describedby` → its error id.
- `checkout-error-summary` banner (role="alert"): **"Please fix the highlighted fields."**
- Focus moves to first invalid field. **No navigation.**

### State 2 — per-field format validation (on blur + on submit)
- Invalid email format → `checkout-error-email`: **"Enter a valid email address."**
- Card fails length/Luhn → `checkout-error-card`: **"Enter a valid card number."**
- (If Bob splits expiry/CVC into their own inputs, add `checkout-error-expiry` "Card has expired." / `checkout-error-cvc` "Enter the 3-digit security code." — optional for MVP.)

### State 3 — success (valid + test mode)
- `checkout-submit` → loading/disabled during submit.
- Navigate to `/checkout/success`; `confirmation-heading` visible: **"Thank you — your order is confirmed."**
- `confirmation-order-id`: **"Order #NW-####"**. `confirmation-email-note`: **"We've emailed your receipt."** (mocked in test mode).
- Cart cleared → `nav-cart-count` = "0".

### State 4 — declined / server error (sentinel `fail@test.com`)
- **No navigation.** `checkout-error-summary` (role="alert"): **"Payment declined — please try another card."**
- Fields retain their values; `checkout-submit` re-enabled. Cart unchanged.

## Add-to-cart states
- **Success:** `pdp-added-toast` (role="status") copy **"Added to your cart."** + `nav-cart-count` increments.
- **Qty bounds:** `pdp-qty` min 1; decrement disabled at 1 (never 0/negative).

## Cart states
- **Empty:** `/cart` with no items → `cart-empty` copy **"Your cart is empty."** + "Shop coffee" CTA; no `cart-checkout-cta`.
- **Populated:** each `cart-line-item` shows name/qty/line-price; `cart-subtotal` updates on qty change; free shipping over $40 (else $5) — show in summary.

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

## Reconciliation notes
- David's contract uses single `checkout-address` + `checkout-card`; my full page spec (`03`) lists granular shipping/payment fields for the visual design. For MVP testing we assert against the canonical ids; Bob can implement granular fields and still expose `checkout-error-<field>` per the above. No conflict — visual richness ≠ extra required test anchors.
- If any element in David's contract doesn't exist in the design, ping me and we amend the contract together (not guess).
