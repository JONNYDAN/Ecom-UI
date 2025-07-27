/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.sanity.io'],
  },
  experimental: {
    largePageDataBytes: 256 * 1000, // Tăng buffer size
  },
  // Cho phép bot Facebook truy cập
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { 
          key: 'Content-Security-Policy',
          value: "default-src 'self' vercel.live cdn.sanity.io *.facebook.com *.fbcdn.net" 
        },
        { key: 'X-Frame-Options', value: 'ALLOW-FROM https://www.facebook.com' }
      ],
    }
  ],
}

module.exports = nextConfig
