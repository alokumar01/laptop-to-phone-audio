# Laptop Audio Share (Next.js + WebRTC + QR)

Production-oriented web tool to stream laptop audio to phone speaker using browser WebRTC.

## Core Features

- Laptop sender with tab/system audio capture.
- Phone listener with QR pairing and low-latency playback.
- Session-based signaling with Socket.IO.
- SEO-ready marketing/content site for SaaS growth.

## Pages

- `/` Home
- `/tool` Tool launcher
- `/share` Laptop sender
- `/listen` Phone listener
- `/how-it-works`
- `/blog`
- `/blog/[slug]`
- `/use-phone-as-speaker`
- `/laptop-sound-to-phone`
- `/phone-wireless-speaker`
- `/turn-phone-into-speaker`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms-and-conditions`
- `/disclaimer`
- `/cookie-policy`

## SEO + Content

- Metadata with canonical, OpenGraph, Twitter cards.
- JSON-LD schema for Organization, WebSite, FAQ, HowTo, Article, and Breadcrumb.
- App Router `sitemap.xml` and `robots.txt` generation.
- Keyword-targeted blog engine with long-form 1200-1500 word article templates.
- 30 SEO topic ideas for editorial backlog.

## Ads + Analytics Readiness

- Reusable ad placeholder component (`AdSlot`) for future AdSense units.
- Ad placeholders in header, in-article sections, sidebar, and footer banner.
- Ads are intentionally excluded from live tool UI routes (`/share`, `/listen`).
- Google Analytics hook via `NEXT_PUBLIC_GA_ID`.
- Google AdSense script hook via `NEXT_PUBLIC_ADSENSE_ID`.

## Security + Abuse Controls

- Room/session ID validation.
- One sender per room policy.
- Listener cap per room.
- Per-socket signaling rate limits.
- Stale room cleanup.

## Project Structure

- `src/app/*`: routes and SEO pages.
- `src/components/*`: UI, layout, ads, schema helpers.
- `src/content/blog-posts.ts`: blog content + keyword topics.
- `src/lib/*`: site config and metadata builders.
- `src/server/signaling.ts`: shared signaling contracts.
- `server.js`: Next.js custom server + Socket.IO signaling and protections.

## Local Development

```bash
npm install
npm run dev
```

Open:

- Sender: `http://localhost:3000/share`
- Listener: `http://localhost:3000/listen?room=<id>`
- Marketing site: `http://localhost:3000/`

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_search_console_token
HOST=0.0.0.0
PORT=3000
```

## Production

```bash
npm run build
npm run start
```

Use HTTPS in production (required for media capture APIs outside localhost).
