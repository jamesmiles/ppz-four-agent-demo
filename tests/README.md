# Test Harness (Tester: David)

End-to-end, smoke, and accessibility tests for the ppz-four-agent-demo platform,
built on [Playwright](https://playwright.dev). Self-contained: own `package.json`
and `playwright.config.ts` so it never collides with the app or the engineer's
Vitest unit tests at repo root.

## Quick start

```bash
cd tests
npm install
npm run install:browsers      # one-time: downloads Chromium (+ deps)
npm test                      # runs all specs against BASE_URL (default :3000)
```

By default Playwright auto-starts the app (`npm run dev` at repo root) and waits
for `http://localhost:3000`. To test an already-running server or a deployed URL:

```bash
TEST_AGAINST_DEPLOY=1 BASE_URL=https://<preview>.vercel.app npm test
```

Other handy commands:

```bash
npm run test:smoke     # smoke layer only
npm run test:ui        # interactive UI mode
npm run test:headed    # watch the browser
npm run report         # open the last HTML report
```

## Configuration

| Env var               | Purpose                                          | Default                 |
|-----------------------|--------------------------------------------------|-------------------------|
| `BASE_URL`            | Target origin for all tests                      | `http://localhost:3000` |
| `WEBSITE_URL`         | Fallback if `BASE_URL` unset (matches the brief) | —                       |
| `TEST_AGAINST_DEPLOY` | If set, don't boot a local server                | unset                   |
| `CI`                  | Enables retries, GitHub reporter, 1 worker       | unset                   |

> No client URL is hard-coded anywhere. Once the real `WEBSITE_URL` lands,
> point `BASE_URL` at it — no code change needed.

## Test layers

1. **Smoke** (`e2e/smoke.spec.ts`) — page renders, 200 status, has a title,
   one `<h1>`, no console errors, no broken same-origin links. The
   "is it alive?" gate run on every PR.
2. **Accessibility** (`e2e/a11y.spec.ts`) — axe-core WCAG 2.1 A/AA checks.
   Catches a11y regressions early instead of at the end.
3. **Functional e2e** (to come) — per-feature flows wired against real routes
   once Cindy's IA + Bob's routes land.

Browsers covered: Chromium, Firefox, WebKit, plus mobile Chrome (Pixel 7).

## How bugs get reported

When a test fails I capture the trace/screenshot/video (auto-saved on failure)
and post to the team:

- **`room`** — a one-line summary: route, what broke, severity.
- **GitHub issue / PR comment** — repro steps + the failing spec + artifact link,
  assigned to Bob (Engineer) or flagged to Cindy (Designer) if it's a design gap.

Severity tags: `blocker` (site down / can't proceed) · `major` (feature broken)
· `minor` (cosmetic / edge case) · `a11y` (accessibility violation).

## Status

Skeleton is live and runs today against any `BASE_URL`. Routes beyond `/` get
added as the IA firms up. Waiting on: Bob's dev server + route list; Cindy's
feature/IA outline; the real `CLIENT_NAME` / `WEBSITE_URL`.
