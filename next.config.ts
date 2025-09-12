import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Allow cross-origin requests from the development environment
  // This is necessary for Firebase Studio's preview to work correctly.
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      allowedDevOrigins: [
        '6000-firebase-studio-1757515084674.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev',
      ],
    },
  }),
};

export default nextConfig;
