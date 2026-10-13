import type { NextConfig } from "next";

const SERVER_API_URL = (process.env.SERVER_API_URL || "http://backend:8000/api").replace(/\/$/, "");
const UPLOADS_ORIGIN = process.env.UPLOADS_ORIGIN || "http://backend:8000";

const nextConfig: NextConfig = {
  htmlLimitedBots: /.*/,
  // Сохраняем завершающий слеш в маршрутах FastAPI.
  skipTrailingSlashRedirect: true,
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
        source: "/api/login",
        destination: `${SERVER_API_URL}/login/`,
      },
      {
        source: "/api/register",
        destination: `${SERVER_API_URL}/register/`,
      },
      {
        source: "/api/pricing",
        destination: `${SERVER_API_URL}/pricing/`,
      },
      {
        source: "/api/chats",
        destination: `${SERVER_API_URL}/chats/`,
      },
      {
        source: "/api/notifications",
        destination: `${SERVER_API_URL}/notifications/`,
      },
      {
        source: "/api/:path*",
        destination: `${SERVER_API_URL}/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${UPLOADS_ORIGIN}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
