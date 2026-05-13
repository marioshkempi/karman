const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    // TODO: we need a good doc to point this to
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys",
  },
]

function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  if (missingEnvs.length > 0) {
    console.error(
      "\n\x1b[1;31m🚫 Error: Missing required environment variables\x1b[0m\n"
    )

    missingEnvs.forEach(function (env) {
      console.error(`  \x1b[1;33m${env.key}\x1b[0m`)
      if (env.description) {
        console.error(`\x1b[2m    ${env.description}\x1b[0m\n`)
      }
    })

    console.error(
      "\x1b[33m\nPlease set these variables in your .env file or environment before starting the application.\n\x1b[0m"
    )

    process.exit(1)
  }
}

module.exports = checkEnvVariables
