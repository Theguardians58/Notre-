export default {
  experimental: {
    ppr: false,
    inlineCss: true,
    useCache: false
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**'
      }
    ]
  }
};
