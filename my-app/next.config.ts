import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output for dev mode
  // output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Enable file watching for public directory
  watchOptions: {
    pollIntervalMs: 1000, // Check for changes every second
  },
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
