import type { NextConfig } from "next";

const UPLOADS_ORIGIN = process.env.UPLOADS_ORIGIN || "http://backend:8000";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [64, 128, 256],
  },
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${UPLOADS_ORIGIN}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
