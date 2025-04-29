/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/todo_apps',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
