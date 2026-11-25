import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: enables Partial Prerendering and the `"use cache"`
  // directive (replaces `experimental.ppr` and `experimental.useCache`).
  cacheComponents: true,
  // Keep today's prefetch behaviour (dynamic data included) for now. Set to
  // `true` to prefetch only the static shell; it becomes the default in the
  // next major.
  partialPrefetching: false,
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};

export default nextConfig;
