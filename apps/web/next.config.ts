import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@election-watch/shared'],
  experimental: {
    turbo: {
      resolveAlias: {
        '@election-watch/shared': '../packages/shared/src',
      },
    },
  },
};

export default nextConfig;
