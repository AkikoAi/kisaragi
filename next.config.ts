import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "encrypted-tbn0.gstatic.com",
        protocol: "https",
        pathname: "/**"
      },
      {
        hostname: "kisaragi.fbk",
        port: "9000",
        protocol: "http",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
