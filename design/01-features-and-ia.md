# Platform — Features & Information Architecture (v0)

**Author:** Cindy (Designer) · **Date:** 2026-05-30 · **Status:** DRAFT — assumptions-based, pending real client brief

> ⚠️ The brief currently carries placeholders `CLIENT_NAME` / `WEBSITE_URL`. Everything below is structured to be **client-agnostic** and revised the moment we get the real client + their existing site. Assumptions are tagged **[A]** so they're easy to challenge or replace.

---

## 1. Assumptions [A]

1. **[A]** The client has an existing website (we were given a `WEBSITE_URL`), so this is a **redesign / re-platform**, not a greenfield brand. Goal: a modern, faster, more capable platform.
2. **[A]** It's a **public-facing product/marketing platform** with: (a) marketing/content pages to explain the offering, and (b) at least one interactive surface (signup, dashboard, booking, catalog, or contact).
3. **[A]** Primary success metric is **conversion** (visitor → lead/signup/purchase) plus credibility and SEO.
4. **[A]** Audiences: prospective customers (primary), existing customers (secondary), and the client's own team (content editors).
5. **[A]** Modern responsive web, mobile-first, accessibility to **WCAG 2.2 AA**.

→ Bob/Alice: when the real URL lands, I'll audit the live site and replace any assumption that's wrong.

## 2. Target Users & Top Tasks

| User | Top tasks |
|------|-----------|
| Prospective customer | Understand the offer, build trust, compare, take action (sign up / buy / contact) |
| Returning customer | Log in, access account/dashboard, get support |
| Content editor (client team) | Publish/edit pages & posts without a developer |

## 3. Core Feature Set (MVP vs Later)

**MVP (launch-critical)**
- Responsive marketing site: Home, Product/Services, Pricing (if applicable), About, Contact
- Primary conversion flow: lead-capture form **or** signup/auth (pick one with client)
- Content/blog with categories + individual post pages (SEO)
- Global nav + footer, search, cookie/consent banner
- Analytics + basic SEO (meta, sitemap.xml, OpenGraph, structured data)
- Accessible, mobile-first components

**Phase 2 (fast-follow)**
- Authenticated area / customer dashboard
- CMS for non-dev editing
- Newsletter / email capture integration
- Localisation / i18n
- Live chat / help center

**Later (nice-to-have)**
- Personalisation, A/B testing, advanced search/filtering, account self-service

## 4. Information Architecture (Sitemap v0)

```
Home
├─ Product / Services
│   ├─ Overview
│   ├─ Feature / Service detail pages
│   └─ Pricing
├─ Solutions / Use cases        [A: if applicable to the vertical]
├─ Resources
│   ├─ Blog / News (index → post)
│   ├─ Guides / Docs
│   └─ FAQ
├─ About
│   ├─ Company / Story
│   ├─ Team
│   └─ Careers                  [A]
├─ Contact
├─ Legal (Privacy, Terms, Cookies)
└─ Account                      [Phase 2]
    ├─ Sign in / Sign up
    └─ Dashboard
```

## 5. Key Page Templates (for Bob to build as components)

1. **Home** — hero (value prop + primary CTA), social proof, feature highlights, secondary CTA, footer
2. **Product/Service detail** — hero, benefits, how-it-works, proof, CTA
3. **Pricing** — tiers, comparison table, FAQ, CTA
4. **Content index + Post** — card grid → article layout (typographic, readable)
5. **Contact / Lead form** — form, validation, success state, alt contact methods
6. **Auth + Dashboard** *(Phase 2)* — sign in/up, shell layout
7. **Utility** — 404, legal/long-form, search results

## 6. Cross-cutting Requirements
- **Accessibility:** WCAG 2.2 AA — keyboard nav, focus states, alt text, contrast ≥ 4.5:1, semantic landmarks
- **Performance:** Core Web Vitals green; lazy-load media; ≤ ~150KB critical JS target
- **SEO:** semantic HTML, metadata, sitemap, structured data, fast TTFB
- **Responsive:** mobile-first, breakpoints ~360 / 768 / 1024 / 1440
- **Testability (for David):** stable `data-testid` hooks on interactive elements; documented happy-path + error states per flow

## 7. Open Questions for the team / client
1. **Real CLIENT_NAME + WEBSITE_URL** (blocker for visual + content direction)
2. Primary conversion goal — lead form, signup, e-commerce, or booking?
3. Is authenticated/account functionality in scope for launch or Phase 2?
4. CMS needed (who edits content), and any preferred provider?
5. Brand assets — logo, colours, fonts, tone — existing guidelines or design fresh?
6. Must-keep pages/content from the existing site (SEO redirects)?

## 8. Handoffs
- **→ Bob (Eng):** §3 feature set + §5 templates + §6 requirements drive the stack & component architecture. Need: repo URL, chosen stack, any CMS decision.
- **→ David (Test):** §5 flows + §6 testability hooks. I'll annotate each flow with explicit happy-path / error states once flows are locked.
- **→ Alice (PM):** §7 open questions need client answers to unblock; §3 MVP/Phase split is the proposed scope line.
