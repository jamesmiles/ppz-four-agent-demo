# `data-testid` Contract — Northwind Coffee Co. (CANONICAL v2, reconciled)

**Owner:** David (Tester). **Reconciled with** Cindy's `design/04-testability.md`.
Cindy owns the UX *states*; this file is the single source of truth for *selectors*.
**Bob: build to exactly these.** Ping me before inventing a new id.

Naming: `data-testid="<area>-<element>[-<variant>]"`, kebab-case. Stable across restyles.

### One deliberate change from Cindy's draft — repeated elements
For lists (product cards, cart lines) use a **generic testid + a `data-slug` attribute**,
NOT a slug-suffixed testid. This lets tests select "the first/any product" without
knowing slugs, *and* target a specific one via `[data-slug="..."]`. Singular elements
keep specific ids.

```
✅  <article data-testid="product-card" data-slug="ethiopia-yirgacheffe">
❌  <article data-testid="product-card-ethiopia-yirgacheffe">
```

## Nav / global
| testid | element |
|---|---|
| `nav-logo` | logo → / |
| `nav-link-shop` / `nav-link-subscriptions` / `nav-link-about` | nav links |
| `nav-cart-button` | cart button → /cart |
| `nav-cart-count` | cart item-count badge |
| `nav-search-button` | search trigger |
| `nav-mobile-toggle` | mobile menu toggle |
| `footer` | footer landmark |

## /shop — grid + filters
| testid | element |
|---|---|
| `shop-grid` | cards container |
| `product-card` | each card *(generic)* — carries `data-slug` |
| `product-card-name` | name within a card |
| `product-card-price` | price within a card |
| `product-card-add` | quick-add button on the card |
| `shop-filter-roast` | roast filter (values `light\|medium\|dark` via option/`data-value`) |
| `shop-filter-origin` | origin filter |
| `shop-filter-grind` | grind filter |
| `shop-filter-clear` | clear-all filters |
| `shop-empty` | no-match empty state |

## /shop/[slug] — PDP
| testid | element |
|---|---|
| `pdp-title` | product title |
| `pdp-price` | price |
| `pdp-roast-badge` | roast badge |
| `pdp-grind-select` | grind selector |
| `pdp-qty-stepper` / `pdp-qty-input` | quantity stepper + input |
| `pdp-add-to-cart` | add-to-cart button |
| `pdp-add-toast` | post-add toast (`role="status"`) |

## /cart
| testid | element |
|---|---|
| `cart-line` | each line *(generic)* — carries `data-slug` |
| `cart-line-name` | line product name |
| `cart-line-qty` | line qty input/stepper |
| `cart-line-remove` | line remove button |
| `cart-subtotal` / `cart-shipping` / `cart-total` | amounts |
| `cart-checkout-button` | → /checkout |
| `cart-empty` | empty-cart state + Shop CTA |

## /checkout — critical form (test-safe submit)
Fields: `checkout-email`, `checkout-name`, `checkout-address1`, `checkout-address2`,
`checkout-city`, `checkout-region`, `checkout-postcode`, `checkout-country`,
`checkout-phone`, `checkout-card-number`, `checkout-card-expiry`, `checkout-card-cvc`.

| testid | element |
|---|---|
| `checkout-form` | the form |
| `checkout-error-<field>` | per-field inline error, e.g. `checkout-error-email` |
| `checkout-form-error` | form-level banner (`role="alert"`) |
| `checkout-summary-total` | order total in summary |
| `checkout-place-order` | submit button |

## /checkout/success — confirmation
| testid | element |
|---|---|
| `confirm-banner` | "order confirmed" banner |
| `confirm-order-number` | order ref — **format `NW-…`** |
| `confirm-continue` | continue-shopping link |

## Utility
| testid | element |
|---|---|
| `not-found` | 404 marker |

---

## Test-safe submit + error sentinel — **DECIDED**
- Test mode: `NEXT_PUBLIC_TEST_MODE=1` (or `?test=1`) → forms POST to a mock handler,
  no real email/payment/analytics, deterministic responses.
- **Error sentinel (canonical, Bob's call): email `fail@test.com` → declined.**
  My spec uses this. Card `4000 0000 0000 0002` is accepted as a *secondary* trigger
  but the email is canonical (zero churn — matches Bob's wiring).
- Success path uses email `shopper@test.com`, card `4242 4242 4242 4242`, valid
  expiry/cvc, real-looking address.

## Form states I assert (per Cindy's `04-testability.md`)
1. Empty submit → every required `checkout-error-<field>` + `checkout-form-error`, no nav.
2. Per-field: invalid email / past expiry / bad card length → matching field error.
3. Success → loading → /checkout/success, `confirm-banner`, cart cleared (`nav-cart-count`→0).
4. Declined (sentinel card) → `checkout-form-error` "Payment declined…", no nav, values retained.
