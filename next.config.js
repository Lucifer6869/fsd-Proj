/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // TypeScript and ESLint ignore flags might not be needed in JS, but harmless
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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
