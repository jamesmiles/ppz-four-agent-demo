# Northwind Coffee Co. — Project Plan

**Client:** Northwind Coffee Co. (fictional specialty coffee roaster) · `northwindcoffee.co`
**Engagement:** Design → Build → Test a marketing + e-commerce platform, end-to-end.
**PM/Coordinator:** Alice · **Designer:** Cindy · **Engineer:** Bob · **Tester:** David
**Status:** Active · **Last updated:** 2026-05-30

> Single source of truth for scope, sequence, and ways of working. PRs welcome — propose
> changes here rather than relitigating in chat.

---

## 1. Goal & Definition of Done

Ship a working, deployable demo platform for Northwind Coffee Co. that a user can browse
end-to-end: discover products, view a product, add to cart, and complete a (stubbed)
checkout with a confirmation. "Done" for the MVP means:

- All MVP routes (§3) implemented and reachable from navigation.
- A user can complete the **golden path**: Home → Shop → Product → Add to cart → Checkout → Confirmation.
- Checkout has a **test-safe submit mode** (no real email/payment) returning deterministic success/error.
- e2e suite green against a deployed preview URL, including one checkout **error** path.
- `main` is always green and deployable (Vercel preview per PR).

## 2. Team & RACI

| Area | Alice (PM) | Bob (Eng) | Cindy (Design) | David (Test) |
|---|---|---|---|---|
| Scope / sequence | **A/R** | C | C | C |
| Features & IA | C | C | **A/R** | C |
| Design system / brand | I | C | **A/R** | I |
| Tech stack & build | C | **A/R** | C | C |
| Testing & QA | C | C | C | **A/R** |
| Release / merge to main | **A** | R | R | R |

A = Accountable, R = Responsible, C = Consulted, I = Informed.

## 3. Scope — MVP routes (canonical, owned by Design)

| Route | Purpose |
|---|---|
| `/` | Home / landing |
| `/shop` | Product grid + filters (roast / origin / grind) |
| `/shop/[slug]` | Product detail (PDP) |
| `/subscriptions` | Subscription plans |
| `/about` | Our Roastery story |
| `/cart` | Cart |
| `/checkout` | Checkout (stubbed payment, test-safe submit) |
| `/checkout/success` | Order confirmation |
| `404` | Not-found |

**Phase 2 (do NOT scaffold now):** `/account`, `/journal` (blog), `/wholesale`, `/contact`,
real payments, auth, reviews, search.

> Note: the engineer's test-safe submit mechanism lives in the **/checkout** flow (the real
> MVP form the tester must cover), not a Phase-2 /contact page.

## 4. Tech stack (owned by Engineering)

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS**
- **shadcn/ui** components (themeable to the Northwind brand)
- **Playwright** (e2e) + **Vitest** (units)
- **Vercel** deploy — preview URL per PR (tester runs e2e against these)
- **Mock data**: seeded product JSON, no backend dependency for the MVP

## 5. Ways of working — Git

GitHub remote is the **single source of truth**.

1. Each agent works on their **own feature branch** (`design/*`, `feat/*`, `scaffold/*`, `test/*`, `pm/*`).
2. Open a **PR into `main`** — never commit to `main` directly.
3. `git pull --rebase origin main` before starting and before every push.
4. Cindy + David physically share one working tree → they use `git worktree add` for isolation.
   Alice + Bob are separate clones (plain branches are fine).
5. Keep PRs small and subdir-scoped: Eng = `/app` + `/src`, Test = `tests/e2e`, Design = `design/`, PM = `docs/`.
6. `main` stays green + deployable at all times.

## 6. Sequence & dependencies

```
Cindy: IA + design tokens + per-page specs + checkout happy/error states
   │
   └──► Bob: scaffold 9 routes ──► theme w/ tokens ──► Vercel preview URL
                   │                                        │
                   └────────────────────────────────────────┘
                                     │
                   David: smoke + a11y (now) ──► golden e2e + error path (vs preview)
```

Parallelism: Bob can scaffold routes immediately from §3; Cindy's visual layer and David's
deep e2e land against the preview as it stabilizes.

## 7. Milestones

| # | Milestone | Owner | Depends on | Status |
|---|---|---|---|---|
| M0 | Roles locked, client + workflow agreed | Alice | — | ✅ done |
| M1 | Design v0 (features + IA) PR | Cindy | M0 | 🟡 PR #1 open |
| M2 | e2e harness skeleton (smoke + a11y) PR | David | M0 | 🟡 PR #2 open |
| M3 | App scaffold (9 routes + test-safe submit) PR | Bob | M0 | 🔵 in progress |
| M4 | Design system + per-page specs | Cindy | M1 | ⬜ next |
| M5 | Preview deploy live (Vercel) | Bob | M3 | ⬜ |
| M6 | Golden e2e + error path green vs preview | David | M4, M5 | ⬜ |
| M7 | MVP review + merge train to main | Alice | M4–M6 | ⬜ |

## 8. Cadence

- Post a **1-line room status** when you open/push a PR or hit a blocker.
- PM triages PRs and keeps the merge train moving; escalate blockers to PM.

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Shared working tree (Cindy/David) clobbering | `git worktree` isolation + PR-only to main |
| Scope creep beyond MVP | Phase-2 list is explicit; PM gates additions |
| Tester blocked waiting on UI | Smoke/a11y + route-existence tests run early; deepen vs preview |
| Real emails/payments firing in tests | Test-safe submit mode (`NEXT_PUBLIC_TEST_MODE=1`/`?test=1`) |
| Design/build drift on routes | Design owns canonical route list (§3); changes via PR here |

## 10. Open questions (PM to resolve vs client persona)

Tracked from Design PR #1 §7 — PM answers against the Northwind Coffee Co. persona and
records decisions in this doc as they land.
