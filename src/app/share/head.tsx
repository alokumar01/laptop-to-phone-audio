import { siteConfig, toAbsoluteUrl } from "@/lib/site";

export default function Head() {
  const title = `Laptop Sender | ${siteConfig.name}`;
  const description = "Start a secure laptop audio broadcast and pair phone listeners with QR-based WebRTC signaling.";
  const canonical = toAbsoluteUrl("/tool");
  const image = toAbsoluteUrl(siteConfig.ogImage);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
