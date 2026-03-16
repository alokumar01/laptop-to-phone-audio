import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Stream Laptop Audio To Phone`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Stream Laptop Audio To Phone`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Stream Laptop Audio To Phone`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/blog?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <JsonLd data={orgSchema} />
        <JsonLd data={websiteSchema} />
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
            </Script>
          </>
        ) : null}
        {adsenseId ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
