import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: false,
    domains: [
      "localhost",
      "img.clerk.com",
      "res.cloudinary.com",
    ],
  },
  webpack: (config, { isServer }) => {
    return config;
  },
};

export default nextConfig;
