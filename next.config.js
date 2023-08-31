/** @type {import('next').NextConfig} */

const dotenv = require('dotenv')

const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['plus.unsplash.com', 'images.unsplash.com'],
  },
  env: dotenv.config().parsed,
}

module.exports = nextConfig
