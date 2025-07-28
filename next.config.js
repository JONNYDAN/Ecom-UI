// /** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.sanity.io'],
  },
  i18n: {
    locales: ['vi', 'en'],  
    defaultLocale: 'en',  
  },
}

module.exports = nextConfig
