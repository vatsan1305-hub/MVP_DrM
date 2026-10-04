import type { NextConfig } from "next";

// GitHub Pages serves this repo at https://<user>.github.io/MVP_DrM/
const basePath = "/MVP_DrM";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: `${basePath}/`,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
