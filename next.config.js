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
    // 🔴 EVITA este bucle recursivo de micromatch
    manuallyTraceFiles: [],
  }
};

module.exports = nextConfig;
