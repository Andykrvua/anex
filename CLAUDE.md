# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

There are no tests in this project.

## Architecture Overview

This is a **Next.js 12** travel agency website (ANEX Tour Ukraine) with **two locales**: `ru` (default) and `uk`. All pages use `getStaticProps` or `getInitialProps` for SSR/SSG data fetching from a Directus CMS backend.

### Data Flow

**Two separate APIs exist:**
- **Internal CMS** (`process.env.API`): Directus instance for content (countries, blog posts, hotels, static data). Accessed server-side via `utils/fetch.js`.
- **Operator/tour search API** (`process.env.OPERATOR_API`): External tour operator API (otpusk.com) for live tour/hotel search. Accessed client-side proxied through `pages/api/endpoints/`.

All CMS fetch functions live in `utils/fetch.js`. They query Directus collections using URL params for filtering, field selection, and deep relation filtering. The `languagesApi` map (`utils/constants.js`) converts locale codes (`ru`/`uk`) to Directus locale format (`ru-RU`/`uk-UA`).

### State Management

Single Zustand store at `store/store.js` holds all global UI state:
- Main search form values: `up` (departure city), `down` (destination country), `date`, `night`, `person`
- Modal state: `modal` (set to a key from `constants.modal` to open a specific modal)
- Burger menu, filter panel, info toast (`windowInfo`)
- Favorites (persisted via zustand `persist`)
- Static CMS data (nav countries list, site-wide config like `captcha_enabled`, GTM id)

Named selector hooks (e.g. `useGetDown`, `useSetModal`) are exported from `store/store.js` — always use these rather than selecting from the store directly.

### Internationalization

- Two locale JSON files: `lang/ru.json`, `lang/uk.json`
- Wrapped with `react-intl` `IntlProvider` in `_app.js`
- Use `useIntl()` hook or `<FormattedMessage id="..." />` in components
- Helper `GetLangField(arr, checkVal, res, loc)` in `utils/getLangField.js` extracts translated fields from Directus relation arrays

### Lead Forms / Order Submission

All lead/order forms submit to the single API route `pages/api/createorder.js`, which:
1. Validates Cloudflare Turnstile captcha for `lead_pick_tour` and `lead_request_call` (if `TURNSTILE_SECRET_KEY` is set and `captcha_enabled` in CMS)
2. POSTs data to the Directus CMS collection matching the `item` field
3. Sends HTML email via Gmail SMTP to `MAIL_TARGET`
4. Sends a confirmation email to the customer if `req.body.email` is present

Client-side wrappers for form submissions are in `utils/nextFetch.js`.

### Page Structure Patterns

- `pages/countries/[slug]/index.js` — country detail page, fetches from `api_countries` collection
- `pages/countries/[slug]/[subpage]/` — country subpages (resorts/cities), from `api_countries_subpage`
- `pages/hotels/[country]/[hotel]/` — individual hotel pages
- `pages/tours/[slug]/` — tour text pages from `tours_text` collection
- `pages/blog/` — blog with category and country filtering

### Key Utilities

- `utils/constants.js` — all shared constants: language maps, modal keys, food types, operator IDs to ignore, API version, price ranges, etc.
- `utils/links.js` — centralized internal route strings
- `utils/changeImageUrl.js` — rewrites Directus admin panel image URLs to the public-facing CDN path (uses `NEXT_PUBLIC_API_ADMIN_PANEL` and `NEXT_PUBLIC_API_HOST`)
- `utils/validators.js` — form field validators
- `utils/getLangField.js` — extracts translated field from Directus `translations` arrays

### Modal System

Global modal rendered in `Layout`. To open a modal, call `setModal(modal.someKey)` from the store. Modal key constants are in `constants.modal`. Modal children components live in `components/common/modalChildren/`.

### Environment Variables

Required env vars (not all are public):
- `API` — Directus CMS base URL (server-side only)
- `ACCESS_TOKEN` — Directus access token
- `OPERATOR_API` — Tour operator API base URL
- `OPERATOR_ACCESS_TOKEN` — Tour operator API token
- `MAIL_SENDER`, `MAIL_SENDER_PASS`, `MAIL_TARGET` — Gmail SMTP credentials
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile server secret
- `NEXT_PUBLIC_API_HOST` — Public site host (used in hreflang, canonical)
- `NEXT_PUBLIC_API_ADMIN_PANEL` — Directus admin panel URL (used to rewrite image URLs)
