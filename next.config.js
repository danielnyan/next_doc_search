/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // comment if you need to deploy w/ Vercel 
  swcMinify: false
}

module.exports = nextConfig
