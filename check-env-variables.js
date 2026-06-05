const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    // TODO: we need a good doc to point this to
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys",
  },
]

function checkEnvVariables() {
  // Load env files if they exist (for Vercel Sandbox environment)
  try {
    const fs = require('fs')
    const path = require('path')
    const envPaths = [
      '/vercel/share/.env.project',
      '/vercel/share/.env.snowflake',
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), '.env')
    ]
    
    envPaths.forEach(envPath => {
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8')
        envContent.split('\n').forEach(line => {
          const trimmed = line.trim()
          if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=')
            if (key && valueParts.length > 0) {
              const value = valueParts.join('=').replace(/^["']|["']$/g, '')
              if (!process.env[key]) {
                process.env[key] = value
              }
            }
          }
        })
      }
    })
  } catch (e) {
    // Silently continue if env loading fails
  }

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
