/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // comment if you need to deploy w/ Vercel
  swcMinify: false,
  webpack: (config) => {
    /* add to the webpack config module.rules array */
    config.module.rules.push({
      /* `test` matches file extensions */
      test: /\.(numbers|xls|xlsx|xlsb)/,
      /* use the loader script */
      use: [ { loader: './base64-loader' } ]
    });
    return config;
  }
}

module.exports = nextConfig
