/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['images.unsplash.com', 'raw.githubusercontent.com', 'picsum.photos', 'api.dicebear.com'], formats: ['image/avif', 'image/webp'] },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  }
}
module.exports = nextConfig;
