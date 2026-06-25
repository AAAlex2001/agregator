const BASE_PATH = "/sfdgkj3546lksfdg89lksfdj";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: BASE_PATH,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
