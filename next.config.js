/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
      'drive.google.com',
      'lh3.googleusercontent.com',
    ],
  },
  typescript: {
    // Don't fail build on type errors (fix them locally)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Don't fail build on lint warnings
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
