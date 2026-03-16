import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog-posts";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/tool",
    "/share",
    "/listen",
    "/how-it-works",
    "/blog",
    "/use-phone-as-speaker",
    "/laptop-sound-to-phone",
    "/phone-wireless-speaker",
    "/turn-phone-into-speaker",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclaimer",
    "/cookie-policy",
  ];

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  })) as MetadataRoute.Sitemap;

  const blogEntries = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  })) as MetadataRoute.Sitemap;

  return [...staticEntries, ...blogEntries];
}
