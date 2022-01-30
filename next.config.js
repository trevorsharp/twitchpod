/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['static-cdn.jtvnw.net'],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
