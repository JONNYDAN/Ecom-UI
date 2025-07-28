// /** @type {import('next').NextConfig} */
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
            key: 'Access-Control-Allow-Origin', 
            value: '*' 
          },
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self' https://www.google-analytics.com",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
