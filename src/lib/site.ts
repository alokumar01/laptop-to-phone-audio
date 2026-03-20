import { publicEnv } from "@/lib/env";

export const siteConfig = {
  name: "Phone Speaker",
  shortName: "Phone Speaker", 
  author: "Alok Kumar",
  github: "https://github.com/alokumar01",
  githubHandle: "alokumar01",
  description:
    "Turn your phone into a wireless speaker for your laptop. Stream audio instantly using WebRTC with no app required.",
  url: publicEnv.baseUrl,
  ogImage: `${publicEnv.baseUrl}/open-graph.png`,
  locale: "en_US",
  keywords: [
    "phone speaker for laptop",
    "use phone as laptop speaker",
    "wireless speaker using phone",
    "stream audio browser to phone",
    "use phone as speaker for laptop",
    "laptop sound to phone",
    "phone as wireless speaker",
    "turn phone into speaker",
    "stream laptop audio to phone",
    "webrtc audio streaming",
    "browser audio cast",
  ],
  nav: [
    { href: "/tool", label: "Tool" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/blog", label: "Blog" },
    { href: "https://github.com/alokumar01", label: "GitHub" },
  ],
  productNav: [
    { href: "/tool", label: "Tool" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/blog", label: "Blog" },
  ],
  companyNav: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  legalNav: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/cookie-policy", label: "Cookie Policy" },
  ],
};

export function toAbsoluteUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}
