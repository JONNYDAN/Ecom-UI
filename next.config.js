/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.sanity.io'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { 
            key: 'Content-Security-Policy',
            value: "default-src 'self' cdn.sanity.io *.facebook.com *.vercel.app" 
          }
        ],
      }
    ];
  }
}

module.exports = nextConfig
