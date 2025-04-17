import { NextConfig } from 'next'

const config: NextConfig = {
  // Eliminar output: 'export' para permitir despliegue con servidor
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default config
