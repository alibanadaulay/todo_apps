/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/todo_apps',
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
