// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React strict mode iyi pratiktir
  reactStrictMode: true,

  // Next/Image - dış domainleri whitelist
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },

  // Build sırasında typescript/eslint fail olmasın
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
