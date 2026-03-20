import type { Metadata } from "next";
import { siteConfig, toAbsoluteUrl } from "@/lib/site";

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = siteConfig.ogImage,
}: BuildMetadataInput): Metadata {
  const url = toAbsoluteUrl(path);
  const metadataTitle = `${title} | ${siteConfig.name}`;
  const imageUrl = image.startsWith("http") ? image : toAbsoluteUrl(image);

  return {
    title: metadataTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      title: metadataTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: metadataTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description,
      images: [imageUrl],
    },
  };
}
