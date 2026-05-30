# Northwind Coffee Co. — Page Specs / Wireframe Notes (v1)

**Author:** Cindy (Designer) · For: Bob (build) + David (test). Components reference `02-design-system.md`. Test hooks listed in `04-testability.md`.

Conventions: each page lists **sections top→bottom**, key **components**, and **content**. All pages share the **global Nav** + **Footer**. Mock data seeded by Bob as JSON (products, subscriptions).

---

## Global chrome
- **Nav** (sticky): logo `Northwind Coffee Co.` → Home. Links: Shop, Subscriptions, About. Right: Search icon, Cart icon w/ count badge. Mobile: hamburger → drawer.
- **Footer**: 4 cols — Shop (Coffee, Subscriptions, Gift) · Company (About, Our Roastery, Careers) · Help (Shipping, Contact, FAQ) · Legal (Privacy, Terms). Newsletter email input + Subscribe. Social row. © Northwind Coffee Co.

## 1. Home `/`
1. **Hero** — full-bleed warm image, `display` headline "Carefully roasted, plainly spoken.", subcopy, primary CTA **Shop Coffee** → /shop, secondary **Explore Subscriptions** → /subscriptions.
2. **Featured products** — 3–4 product cards ("Best sellers") → PDP.
3. **Roast spectrum** — Light/Medium/Dark tiles linking to filtered /shop.
4. **Our story strip** — short blurb + image → /about.
5. **Subscription teaser** — "Fresh beans on your schedule" + CTA → /subscriptions.
6. **Trust row** — freshly roasted, free shipping over $40, ethically sourced (icon + label).
7. **Newsletter** (in footer).

## 2. Shop `/shop`
- **Header**: title "Shop Coffee", result count.
- **Filter bar** (left rail desktop / top sheet mobile): Roast (Light/Medium/Dark), Origin (Ethiopia/Colombia/Brazil/Sumatra…), Grind (Whole bean/Filter/Espresso). Multi-select chips; "Clear filters". Filtering is client-side over mock JSON; reflected in URL query (`?roast=dark`).
- **Product grid**: responsive cards (1/2/3/4 cols). Each: image, name, roast badge, origin, price, **Add to cart**.
- **Empty state**: when filters match nothing — illustration + "No coffees match. Clear filters."

## 3. Product detail `/shop/[slug]`
1. **Breadcrumb** Shop / [name].
2. **Gallery** (left) + **Buy box** (right): name (h1), roast badge, origin, tasting notes, price, **grind selector** (dropdown), **quantity stepper**, **Add to cart** (primary). Stock status.
3. **Details tabs/accordion**: Description, Origin & farm, Brewing guide.
4. **You might also like** — 3 related cards.
- Add-to-cart → toast confirmation + cart badge increments (no forced redirect).

## 4. Subscriptions `/subscriptions`
1. **Hero**: "Never run out of great coffee."
2. **How it works**: 3 steps (Choose beans → Pick frequency → We roast & ship).
3. **Plans**: 3 cards — Solo (1 bag), Duo (2 bags), Office (4 bags); frequency toggle (Weekly/Fortnightly/Monthly) updates price; "Most popular" on Duo. CTA **Start subscription** (Phase-2 stub → adds a subscription item to cart or shows "coming soon" modal — confirm w/ Bob).
4. **FAQ** accordion (pause/skip/cancel anytime).

## 5. About / Our Roastery `/about`
1. **Hero**: roastery image + "Our Roastery".
2. **Story** prose (founding, sourcing ethos).
3. **Process** — Source → Roast → Cup (image + text rows).
4. **Values** — 3 cards (Direct trade, Small batch, Freshness).
5. **CTA** → /shop.

## 6. Cart `/cart`
- **Line items**: thumb, name, grind, qty stepper, line price, remove. Update qty recalculates.
- **Order summary** (right/below): subtotal, shipping (free over $40 else $5), total. **Checkout** CTA → /checkout.
- **Empty cart** state: "Your cart is empty" + Shop CTA.
- Persist cart in localStorage (client-side; no auth).

## 7. Checkout `/checkout` *(stubbed payment)*
Single page, 3 grouped sections + summary sidebar:
1. **Contact**: email.
2. **Shipping**: name, address1, address2, city, region, postcode, country, phone.
3. **Payment (stub)**: card number, expiry, CVC — clearly labelled "Demo — no real charge". Validate format only.
4. **Summary sidebar**: items, subtotal, shipping, total. **Place order** (primary).
- On submit (TEST mode via Bob's `NEXT_PUBLIC_TEST_MODE`/`?test=1`): deterministic success → /checkout/success; deterministic error path available for David (e.g. card `4000000000000002` → declined).
- Full validation: required fields, email format, card-format, expiry not past. Inline errors. See `04-testability.md` for exact states.

## 8. Order Confirmation `/checkout/success`
- Success banner (green check), "Thank you — order #NW-XXXX confirmed."
- Order summary (items, total, shipping address), "What happens next" (roast & ship), **Continue shopping** → /shop.
- Reachable only post-checkout; direct visit → friendly fallback or redirect to /shop.

## 9. 404 `/not-found`
- Friendly "This page got lost on the way to the roastery." + Home + Shop CTAs + search.

---
### Notes for Bob
- Cart + filter state are client-side (localStorage / URL query) — no backend needed for MVP.
- Seed `data/products.json` (~12 coffees w/ slug, name, roast, origin, grindOptions, price, tastingNotes, img) + `data/subscriptions.json`.
- Subscriptions "Start" + Payment are **stubs** — keep behind test-safe mode.
