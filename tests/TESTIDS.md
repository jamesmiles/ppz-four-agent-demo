# `data-testid` Contract — Northwind Coffee Co.

**Owner:** David (Tester) · **For:** Bob (Engineer) to implement, Cindy (Designer) to annotate states.

This is the **contract** my e2e specs select against. If Bob adds these `data-testid`
attributes while building, the golden-path tests pass with zero churn. Naming scheme:
`<area>-<element>[-<variant>]`, all kebab-case. Keep them stable across restyles —
they're test anchors, not style hooks.

> Add a `data-testid` to the **interactive or assertion-critical** element only
> (buttons, inputs, cards, status banners, totals). Don't tag every `<div>`.

## Global — layout / nav / footer

| testid | Element |
|---|---|
| `nav-logo` | Home link / logo in header |
| `nav-link-shop` | Nav link → /shop |
| `nav-link-subscriptions` | Nav link → /subscriptions |
| `nav-link-about` | Nav link → /about |
| `nav-cart` | Cart icon/button in header (→ /cart) |
| `nav-cart-count` | Item-count badge on the cart icon |
| `footer` | Footer landmark |

## /shop — product grid + filters

| testid | Element |
|---|---|
| `shop-grid` | Container wrapping product cards |
| `shop-card` | Each product card (repeated; use `.nth()` / filter by name) |
| `shop-card-name` | Product name within a card |
| `shop-card-price` | Price within a card |
| `shop-card-link` | Link from card → PDP |
| `shop-filter-roast` | Roast filter control |
| `shop-filter-origin` | Origin filter control |
| `shop-filter-grind` | Grind filter control |
| `shop-empty` | "No products match" empty state |

## /shop/[slug] — product detail (PDP)

| testid | Element |
|---|---|
| `pdp-name` | Product title |
| `pdp-price` | Price |
| `pdp-grind-select` | Grind/variant selector |
| `pdp-qty` | Quantity input |
| `pdp-add-to-cart` | Add-to-cart button |
| `pdp-added-toast` | Confirmation toast/banner after add |

## /cart

| testid | Element |
|---|---|
| `cart-line-item` | Each line item (repeated) |
| `cart-line-name` | Line item product name |
| `cart-line-qty` | Quantity stepper/input |
| `cart-line-remove` | Remove-line button |
| `cart-subtotal` | Subtotal amount |
| `cart-checkout-cta` | Proceed-to-checkout button |
| `cart-empty` | Empty-cart state |

## /checkout — stubbed payment, **test-safe submit mode**

Form posts to a mock handler when `NEXT_PUBLIC_TEST_MODE=1` (or `?test=1`) — no real
email/payment — returning deterministic success/error so I can assert both paths.

| testid | Element |
|---|---|
| `checkout-form` | The form element |
| `checkout-email` | Email input |
| `checkout-name` | Full-name input |
| `checkout-address` | Address input |
| `checkout-card` | Card-number input (stub) |
| `checkout-submit` | Place-order button |
| `checkout-error-summary` | Top-of-form error banner (server/validation failure) |
| `checkout-error-<field>` | Per-field error msg, e.g. `checkout-error-email` |

**Deterministic error trigger (please wire one):** a sentinel that forces the mock
handler to return an error — e.g. email `fail@test.com` → declined/`500`. This lets the
error-path test be reliable. Confirm the trigger value with me, Bob.

## /checkout/success — order confirmation

| testid | Element |
|---|---|
| `confirmation-heading` | "Thank you / order confirmed" heading |
| `confirmation-order-id` | Order reference number |
| `confirmation-email-note` | "We emailed you" note (mocked in test mode) |

## Utility

| testid | Element |
|---|---|
| `not-found` | 404 page marker |

---

### Notes for the team
- **Bob:** these are additive `data-testid` attrs — no design impact. Ping me if any
  element doesn't exist so we adjust the contract instead of me guessing.
- **Cindy:** please map each `*-error-*` / empty / success state to a documented
  happy/error annotation so I know the exact expected copy/behavior to assert.
- This file is the single source of truth for selectors; specs import nothing else.
