import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output ONLY when building for Docker (avoids Vercel ENOENT nft.json error)
  ...(process.env.BUILD_STANDALONE === "true" ? { output: "standalone" } : {}),
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.vietqr.io",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
    ],
  },
};

export default nextConfig;
