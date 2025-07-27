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
        source: '/product/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://www.facebook.com'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://www.facebook.com"
          }
        ]
      },
      // Áp dụng cho toàn site
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },
}

module.exports = nextConfig
