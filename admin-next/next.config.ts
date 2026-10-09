import type { NextConfig } from "next";

const BASE_PATH = "/sfdgkj3546lksfdg89lksfdj";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: BASE_PATH,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  async redirects() {
    return [
      { source: "/new", destination: "/articles/new", permanent: true },
      { source: "/edit/:id", destination: "/articles/:id", permanent: true },
      { source: "/rtn/edit/:id", destination: "/rtn/:id", permanent: true },
    ];
  },
};

export default nextConfig;
