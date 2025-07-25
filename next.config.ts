import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
  output: "standalone",
  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: false,
  },
  env: {
    NEXT_API_BASE_URL: process.env.NEXT_API_BASE_URL,
  },
};

module.exports = nextConfig;
