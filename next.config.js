/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icons.dexie.space',
        pathname: '/**',
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['react', 'react-dom'],
  },
};

module.exports = nextConfig;
