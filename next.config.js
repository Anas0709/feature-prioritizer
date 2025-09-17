/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [],
  },
  // Optimize for static export if needed
  // output: 'export',
  // trailingSlash: true,
}

module.exports = nextConfig
