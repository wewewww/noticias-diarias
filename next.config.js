/** @type {import('next').NextConfig} */
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
  // Evita rastrear archivos (build tracing) que provocan loop
  outputFileTracingExcludes: {
    '*': [
      '**/node_modules/**/micromatch/**',
    ],
  },
};

module.exports = nextConfig;
