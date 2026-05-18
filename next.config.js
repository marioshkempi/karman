const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()
const withNextIntl = require("next-intl/plugin")(
  // Point to your i18n request configuration
  "./src/i18n/request.ts"
)
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "syn-medusa-js-bucket.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "188.245.98.174",
      },
      {
        protocol: "https",
        hostname: "bio-kifisia.gr",
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig)
