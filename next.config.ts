import type { NextConfig } from "next";
import os from "node:os";
import path from "node:path";

function getLanDevOrigins() {
  const origins = new Set<string>();
  try {
    const interfaces = os.networkInterfaces();
    for (const entries of Object.values(interfaces)) {
      if (!entries) continue;
      for (const entry of entries) {
        if (entry.family === "IPv4" && !entry.internal) {
          origins.add(entry.address);
        }
      }
    }
  } catch {
    // Ignore interface discovery failure in restricted build/runtime environments.
  }

  const envOrigins =
    process.env.ALLOWED_DEV_ORIGINS?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  for (const host of envOrigins) {
    origins.add(host);
  }

  return Array.from(origins);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  turbopack: {
    root: path.join(__dirname),
  },
  allowedDevOrigins: getLanDevOrigins(),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
