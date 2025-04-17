const micromatch = require('micromatch');
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    manuallyTraceFiles: true,
    traceIgnorePatterns: [
      '**/*.log',
      '**/*.tmp',
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/out/**'
    ]
  }
};

module.exports = nextConfig;
