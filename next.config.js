/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['static-cdn.jtvnw.net'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path/feed',
          destination: '/api/:path',
        },
        {
          source: '/videos/:path*',
          destination: '/api/videos/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
