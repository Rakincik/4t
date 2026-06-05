// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Gzip sıkıştırma (sayfa boyutunu %60-70 küçültür)
  compress: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "www.transparenttextures.com" },
      { protocol: "https", hostname: "grainy-gradients.vercel.app" },
    ],
    // WebP/AVIF otomatik dönüşüm
    formats: ["image/avif", "image/webp"],
    // Cihaz boyutuna göre responsive görseller
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Görselleri 1 saat cache'le
    minimumCacheTTL: 3600,
  },

  // Statik dosyalar için tarayıcı cache
  headers: async () => [
    {
      source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff2)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],

  typescript: {
    ignoreBuildErrors: true,
  },

  // Kullanılmayan paket parçalarını dışla (bundle küçültme)
  experimental: {
    optimizePackageImports: [
      "@heroicons/react",
      "framer-motion",
      "recharts",
    ],
  },
};

export default nextConfig;