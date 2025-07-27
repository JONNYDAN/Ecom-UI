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
            value: [
              // Các directive cơ bản
              "default-src 'self'",
              
              // Cho phép các script cần thiết
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.facebook.com *.vercel.app chimpstatic.com embed.tawk.to",
              "script-src-elem 'self' 'unsafe-inline' *.facebook.com *.vercel.app chimpstatic.com embed.tawk.to",
              
              // Cho phép các style
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              
              // Cho phép các hình ảnh
              "img-src 'self' data: blob: cdn.sanity.io *.facebook.com *.fbcdn.net chimpstatic.com tawk.to",
              
              // Cho phép kết nối
              "connect-src 'self' *.sanity.io *.facebook.com *.vercel.app chimpstatic.com embed.tawk.to",
              
              // Cho phép font
              "font-src 'self' fonts.gstatic.com"
            ].join('; ')
          }
        ],
      },
    ];
  }
}

module.exports = nextConfig
