/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to enable server-side rendering
  images: {
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 