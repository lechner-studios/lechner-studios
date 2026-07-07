# Lechner Studios

> Web, Identity & Growth — the umbrella brand website for Lechner Studios, an openly AI-native, family-run studio in Wattens, Tirol.

## Status

**Live in production** at **[lechner-studios.at](https://lechner-studios.at)**, deployed on Vercel.

The site is in its founding phase (2026) and is actively maintained — see the recent commit history and the weekly `main-health` and per-PR `pr-ci` checks. A `MAINTENANCE_MODE` middleware gate can take the public surface offline without a redeploy when needed.

## What this is

This repository is the **umbrella brand website** for Lechner Studios — the studio's primary marketing and journal surface. It is a bilingual (German / English), locale-routed Next.js App Router application. Alongside the brand story it hosts:

- A **studio journal / blog** with an AI-assisted authoring pipeline (drafts are generated, linted, and published via GitHub Actions).
- A **Studio Director chat** — an on-site assistant backed by the Anthropic API.
- A **contact / project-intake flow** with server-side rate limiting and transactional email notification.

The studio positions itself around four disciplines, all reflected in the site's content and routes:

- **Web & Design**
- **Apps & Automation**
- **SEO & Growth**
- **Brand & Identity**

"AI-native" here is literal, not a slogan: the blog pipeline and the Studio Director chat are shipped, working features in this codebase (see [Repository structure](#repository-structure)).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router, TypeScript) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`), CSS custom-property design tokens |
| i18n | Locale-routed `de` / `en` (`de` default) with `hreflang` alternates |
| AI | `@anthropic-ai/sdk` — Studio Director chat + blog authoring |
| Content | Markdown in `content/blog` via `gray-matter`, `react-markdown`, `remark-gfm` |
| Email | `nodemailer` (transactional contact notifications) |
| Rate limiting | `@upstash/ratelimit` + `@upstash/redis` |
| Analytics | Vercel Web Analytics (cookieless) |
| Error tracking | Sentry (EU region) — optional, off unless a DSN is configured |
| Testing | Playwright (end-to-end) |
| Lint | ESLint 9 (`eslint-config-next`) |
| Hosting | Vercel |

## Repository structure

```
src/
  app/
    (site)/[locale]/     Locale-routed pages: about, work, blog, contact,
                         start, apps-automation, seo, brand, impressum, privacy
    (offline)/           Maintenance surface
    api/
      chat/              Studio Director chat endpoint (Anthropic)
      contact/           Contact / intake form handler
    robots.ts            robots.txt
    sitemap.ts           Bilingual, locale-prefixed sitemap
    globals.css          Design tokens + responsive utility classes
  components/            React components (Nav, Hero, Footer, legal pages, chat, …)
  context/               React context (language state)
  i18n/                  Locale config + dictionaries
  lib/                   blog, seo, studio-director, monitoring helpers
  middleware.ts          Locale routing + maintenance-mode gate
content/blog/            Markdown blog posts
scripts/blog/            Blog generate / lint / emit pipeline (+ tests)
public/                  Fonts, favicons, brand and OG assets
tests/                   Playwright e2e specs
docs/                    Audits and reference notes
.github/workflows/       pr-ci, main-health, blog-generate, indexnow-ping
```

Repo-local conventions (design tokens, typography variables, the mobile
breakpoint, i18n rules, and legal-page rules) live in
[`CONVENTIONS.md`](CONVENTIONS.md); agent-facing canonical references live in
[`AGENTS.md`](AGENTS.md). Read those before touching any UI, brand, copy, or
legal surface.

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve a production build |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run blog:generate` | Generate a blog draft via the authoring pipeline |

### Environment variables

The site runs without any secrets in maintenance mode; individual features
activate only when their variables are present. Configure the relevant ones
(for example in `.env.local` for development, or in the Vercel project
settings for deployment). **Do not commit secrets** — the repository's Layer-0
pre-commit scan will reject them.

| Variable | Purpose |
|---|---|
| `MAINTENANCE_MODE` | When set, serves the offline surface instead of the site |
| `ANTHROPIC_API_KEY` | Studio Director chat (`/api/chat`) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limiting store |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Alternate KV backing for rate limiting |
| `ZEPTOMAIL_TOKEN`, `ZEPTOMAIL_FROM` | Transactional email transport for contact notifications |
| `CONTACT_NOTIFY_EMAIL` | Recipient address for contact-form notifications |
| `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_ENV`, `NEXT_PUBLIC_SENTRY_RELEASE` | Optional Sentry error tracking (EU region) |
| `NEXT_PUBLIC_BOOKING_URL` | External booking link surfaced in CTAs |
| `NEXT_PUBLIC_DEMOS_LIVE`, `NEXT_PUBLIC_SHOW_HOW_WE_WORK` | Feature flags |

## Testing & CI

- **`pr-ci`** — every pull request runs lint, build, and Playwright e2e (against a real `next start` build) before merge.
- **`main-health`** — weekly build of `main`; opens a tracking issue on failure and auto-closes it on recovery.
- **`blog-generate`** — scheduled / on-demand blog authoring; auto-publishes on green checks.
- **`indexnow-ping`** — notifies search engines of new/updated URLs.

## Deployment

Deployed on **Vercel**, serving **[lechner-studios.at](https://lechner-studios.at)**.
Security headers and route redirects are defined in
[`next.config.ts`](next.config.ts); the `sitemap.ts` and `robots.ts` route
handlers publish the sitemap and robots policy.

## Related repositories

Sibling first-party repositories in the [`lechner-studios`](https://github.com/lechner-studios) organization:

| Repo | Role |
|---|---|
| `websites` | Canonical brand specs, the Werk storefront (`werk.lechner-studios.at`), and the demos app |
| `ai-brain` | Shared engineering, security, and brand patterns / standards |
| `flashcards-programming-app` | CodeFlash — the studio's spaced-repetition learning product |
| `automatedcontentcreator` | Content production pipeline |

## License

Proprietary — © Lechner Studios. All rights reserved.
