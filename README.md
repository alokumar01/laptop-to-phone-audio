# Laptop Audio Share

Stream laptop audio to a phone browser with WebRTC, QR-based pairing, and a production-ready Next.js marketing site.

## Stack

- Next.js 16 App Router
- Tailwind CSS 4
- Framer Motion
- Socket.IO signaling
- WebRTC audio streaming

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Public app/runtime configuration lives in `.env.local` for local development and in Vercel project settings for production.

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_SIGNALING_URL=https://signal.your-domain.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ENABLED=false
NEXT_PUBLIC_STUN_URL=stun:stun.l.google.com:19302
NEXT_PUBLIC_TURN_URL=
NEXT_PUBLIC_TURN_USERNAME=
NEXT_PUBLIC_TURN_CREDENTIAL=
```

Server runtime variables for the standalone signaling server:

```bash
HOST=0.0.0.0
PORT=3000
ALLOWED_DEV_ORIGINS=
ALLOWED_SIGNALING_ORIGINS=https://your-domain.com
```

## CI

The repository is configured to pass:

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

GitHub Actions runs the same checks on pushes to `main` and `dev`, plus pull requests.

## Deployment architecture

This repository contains two concerns:

1. The Next.js web app
2. A Socket.IO signaling server in `server.js`

Important: Vercel can host the Next.js app, but it is not the right runtime for the long-lived Socket.IO server in `server.js`.

Recommended production setup:

1. Deploy the Next.js app to Vercel
2. Deploy the signaling server to a Node host such as Railway, Render, Fly.io, or a VPS
3. Set `NEXT_PUBLIC_SIGNALING_URL` in Vercel to the signaling server origin
4. Set `ALLOWED_SIGNALING_ORIGINS` on the signaling server to the public app origin
5. Add TURN credentials with the public TURN env vars for cross-network reliability

For same-origin self-hosting on a VPS, you can still run:

```bash
npm run build
npm run start
```

## SEO and ads

The app includes:

- route-level metadata
- OpenGraph and Twitter cards
- `sitemap.xml`
- `robots.txt`
- article, FAQ, and breadcrumb structured data
- About, Contact, Privacy Policy, Terms, Disclaimer, and Cookie Policy pages

AdSense components render only when enabled through environment variables and are intentionally excluded from the live sender/listener dashboards.

## Notes on WebRTC

- LAN works with STUN-only in favorable conditions
- Cross-network use should add TURN
- Browser screen capture requires localhost during local development or HTTPS in production

## Author

Built by Alok Kumar  
GitHub: https://github.com/alokumar01
