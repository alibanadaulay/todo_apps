/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/todo_apps',
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
  distDir: 'out',
};

module.exports = nextConfig;
