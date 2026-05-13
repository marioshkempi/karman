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
    unoptimized: true, // allows any image URL (no optimization)

    // remotePatterns: [
    //   {
    //     protocol: "http",
    //     hostname: "localhost",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "medusa-server-testing.s3.amazonaws.com",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
    //   },
    // ],
  },
}

module.exports = withNextIntl(nextConfig)
