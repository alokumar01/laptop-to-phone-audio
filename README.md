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

Open the development URL shown by Next.js in your terminal.

## Environment variables

Public app/runtime configuration lives in `.env.local` for local development and in Vercel project settings for production.

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_SIGNALING_URL=https://signal.whoisalok.tech
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ENABLED=false
NEXT_PUBLIC_STUN_URL=stun:stun.l.google.com:19302
NEXT_PUBLIC_TURN_URL=
NEXT_PUBLIC_TURN_USERNAME=
NEXT_PUBLIC_TURN_CREDENTIAL=
```

## CI

The repository is configured to pass:

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

GitHub Actions runs the same checks on pushes to `main` and `dev`, plus pull requests.

## Deployment architecture

Recommended production setup:

1. Deploy the Next.js app to Vercel
2. Keep the signaling server on AWS EC2 at `https://signal.whoisalok.tech`
3. Set `NEXT_PUBLIC_SIGNALING_URL` in Vercel to the signaling server origin
4. Set `NEXT_PUBLIC_BASE_URL` in Vercel to the public app origin
5. Add TURN credentials with the public TURN env vars for cross-network reliability

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
- Browser screen capture requires a secure context in production

## Author

Built by Alok Kumar  
GitHub: https://github.com/alokumar01
