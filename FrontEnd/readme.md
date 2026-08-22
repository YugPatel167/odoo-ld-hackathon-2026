# GlobeTrotter — Frontend

## What's in here
- `home.html`, `about.html`, `contact.html` — public pages (no login needed)
- `dashboard.html` — protected page, needs a logged-in user
- `css/styles.css` — shared design system (colors, type, nav, footer, cards, chatbot). Import this on EVERY page, including login/signup.
- `css/dashboard.css`, `css/home.css` — page-specific styles
- `js/api.js` — all backend calls go through here. **Change `API_BASE` at the top once you know the real backend URL/port.**
- `js/nav.js` — logout button + active nav link + fills in user name/avatar
- `js/chatbot.js` — rule-based chatbot widget, works with zero backend
- `server/routes-example.js` — the exact API shape the frontend expects, plus a matching MySQL schema, for your backend teammate

## Design system (use these everywhere, including login/signup)
Colors:
- `--ink: #13293D` — headers, dark surfaces
- `--ink-2: #1E4B5F` — hover/gradient
- `--parchment: #F6F1E3` — page background
- `--card: #FFFDF7` — card surface
- `--brass: #B98530` — links, accents
- `--coral: #E1572C` — primary buttons/CTAs
- `--sage: #6E8F6B` — on-budget/positive
- `--rust: #B5482A` — over-budget/errors

Fonts: `Fraunces` (headings), `Work Sans` (body), `IBM Plex Mono` (numbers/data — used for prices, trip IDs).

**To match the login/signup page to this system:** link `css/styles.css` on those pages too, and reuse `.btn`, `.btn-primary`, `.card`, and the `.field`/`.field-error` pattern from `contact.html`.

## Backend contract (give to your DB teammate)
The frontend expects these endpoints — see `server/routes-example.js` for full implementation + schema:
- `GET /api/me`
- `GET /api/trips?limit=&sort=`
- `GET /api/budget/summary`
- `GET /api/cities/recommended?limit=`
- `POST /api/logout`
- `POST /api/contact`

All use `credentials: "include"` — the backend should set an **httpOnly session cookie** on login (safer than localStorage), not return a token the frontend stores itself.

## Still needed (not built yet — cut for time, build if hours remain)
- `create-trip.html` — form: name, dates, description → `POST /api/trips`
- `my-trips.html` — full trip list, reuses the `.ticket` component from dashboard
- `itinerary.html` — itinerary builder/view (linked from trip tickets already)
- `login.html` / `signup.html` — restyle with `css/styles.css` for visual consistency

## Chatbot
Currently rule-based (`js/chatbot.js`, `CHATBOT_RULES` array) — works instantly, no backend needed, good enough for a demo. To upgrade to a real AI-backed bot later, add a `POST /api/chatbot` route and swap the `chatbotReply()` function to call it instead.
