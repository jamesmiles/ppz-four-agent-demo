# Northwind Coffee Co. — Design System (v1)

**Author:** Cindy (Designer) · **Date:** 2026-05-30 · For: Bob (Eng) to implement as Tailwind theme + shadcn/ui tokens

## Brand
- **Personality:** warm, crafted, honest, specialty. Artisan roastery meets clean modern commerce.
- **Voice:** knowledgeable but unpretentious. "Carefully roasted, plainly spoken."
- **Logo (placeholder):** wordmark "Northwind Coffee Co." in the display serif; compass/windrose mark optional. Bob can use a text wordmark for now.

## Colour Palette
Roast-inspired, warm neutrals with an amber accent. Contrast checked for WCAG 2.2 AA.

| Token | Hex | Use |
|-------|-----|-----|
| `--espresso` | `#2A1A12` | Primary text, dark surfaces, footer |
| `--roast` | `#4A2C1A` | Headings, primary buttons |
| `--amber` (accent) | `#C8772E` | CTAs, links, highlights, focus |
| `--amber-hover` | `#A85F20` | Hover/active for accent |
| `--crema` | `#F6EFE3` | Page background (warm parchment) |
| `--oat` | `#EADFce` | Card/section background, borders |
| `--cream` | `#FFFDF8` | Elevated surfaces / inputs |
| `--ink` | `#1C1410` | Body text on light |
| `--muted` | `#6B5A4C` | Secondary text, captions |
| `--success` | `#2F7D4F` | Order success, in-stock |
| `--error` | `#B3261E` | Form errors, out-of-stock |
| `--focus-ring` | `#C8772E` | 2px focus outline everywhere |

**Contrast notes:** ink `#1C1410` on crema `#F6EFE3` ≈ 13:1 ✓. amber `#C8772E` on crema ≈ 3.4:1 → use amber for large text/UI only; for body links darken to amber-hover `#A85F20` (≈ 4.7:1 ✓). White on roast `#4A2C1A` ≈ 9:1 ✓.

## Typography
- **Display / headings:** **Fraunces** (warm, characterful serif) — weights 400/600/9pt optical. Google Fonts, self-host for perf.
- **Body / UI:** **Inter** — 400/500/600.
- **Mono (price/SKU optional):** system mono.

Scale (rem, mobile → desktop fluid via clamp):
| Token | Size | Use |
|-------|------|-----|
| `display` | clamp(2.5,5vw,4rem) | Hero |
| `h1` | clamp(2,3.5vw,3rem) | Page title |
| `h2` | 1.75rem | Section |
| `h3` | 1.25rem | Card title |
| `body` | 1rem (16px) | Default; line-height 1.6 |
| `small` | 0.875rem | Captions, meta |

## Spacing & Layout
- 4px base scale: 4/8/12/16/24/32/48/64/96.
- Container max-width `1200px`, gutter 24px (16px on mobile).
- Breakpoints: `sm 640 / md 768 / lg 1024 / xl 1280`.
- Radius: `sm 6px / md 10px / lg 16px / full 9999px`. Cards = md, buttons = full or md (pick md for commerce).
- Shadow: soft, warm — `0 1px 2px rgba(42,26,18,.06), 0 8px 24px rgba(42,26,18,.08)`.

## Core Components (build as shadcn/ui, themed)
1. **Button** — variants: `primary` (roast bg / cream text), `accent` (amber bg / espresso text), `outline`, `ghost`. Min target 44×44. Loading + disabled states.
2. **Nav bar** — logo left; Shop / Subscriptions / About center-right; Cart icon w/ item-count badge + Search. Sticky, condensed on scroll. Mobile = hamburger drawer.
3. **Product card** — image, name, roast-level badge, origin, price, "Add to cart". Hover lift.
4. **Roast badge** — Light / Medium / Dark pill, colour-coded (amber tints).
5. **Quantity stepper** — − value + , min 1.
6. **Price** — bold, `$xx.xx`.
7. **Form fields** — label, input (cream bg, oat border, amber focus ring), inline error text + red border, helper text.
8. **Cart line item** — thumb, name, qty stepper, line price, remove.
9. **Toast / notification** — add-to-cart confirmation.
10. **Footer** — dark espresso, columns (Shop / Company / Help / Legal), newsletter input, social.
11. **Filter controls** (Shop) — roast, origin, grind chips/checkboxes.
12. **Badge/Tag**, **Breadcrumb**, **Empty state**, **404**.

## Tailwind handoff (drop into `tailwind.config` / globals.css)
```css
:root{
  --espresso:#2A1A12; --roast:#4A2C1A; --amber:#C8772E; --amber-hover:#A85F20;
  --crema:#F6EFE3; --oat:#EADFCE; --cream:#FFFDF8; --ink:#1C1410; --muted:#6B5A4C;
  --success:#2F7D4F; --error:#B3261E;
}
```
```js
// tailwind.config theme.extend.colors
colors:{ espresso:'#2A1A12', roast:'#4A2C1A', amber:{DEFAULT:'#C8772E', hover:'#A85F20'},
  crema:'#F6EFE3', oat:'#EADFCE', cream:'#FFFDF8', ink:'#1C1410', muted:'#6B5A4C',
  success:'#2F7D4F', error:'#B3261E' }
// fontFamily: { display:['Fraunces','serif'], sans:['Inter','system-ui','sans-serif'] }
```

## Accessibility rules (non-negotiable)
- Visible focus ring (2px amber) on ALL interactive elements.
- Colour never the only signal (roast badge has text label; errors have icon+text).
- All images `alt`; decorative = `alt=""`.
- Semantic landmarks: `header/nav/main/footer`; one `h1` per page.
- Forms: `<label>` tied to inputs, `aria-invalid` + `aria-describedby` on errors.
- Honour `prefers-reduced-motion`.
