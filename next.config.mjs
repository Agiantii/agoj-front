/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  fastRefresh: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
