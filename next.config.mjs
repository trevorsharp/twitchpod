import { env } from './src/server/env.mjs';

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
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
});
