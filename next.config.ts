import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
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
