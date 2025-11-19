import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // enable any experimental features you rely on here:
    appDir: true
  },
  images: {
    // add domains you load remote images from, e.g. if you use external imagery
    domains: ["images.unsplash.com", "raw.githubusercontent.com"],
    formats: ["image/avif", "image/webp"]
  },
  // small optimization for headers/caching you can add later
};

export default nextConfig;
