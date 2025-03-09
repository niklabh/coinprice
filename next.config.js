/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  // Disable image optimization - required for static export
  images: {
    unoptimized: true,
  },
  // No base path to avoid navigation issues
  basePath: '',
  // Customize asset prefix to match deployment
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Ignore type checking during build for static export
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable features that require server-side rendering
  experimental: {
    ppr: false,
  },
  // Treat all routes as client-side only
  trailingSlash: false,
}

module.exports = nextConfig 