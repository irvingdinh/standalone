import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:25710/api/:path*',
      },
    ];
  },
};

export default nextConfig;
