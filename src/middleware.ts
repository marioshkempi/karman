//SUPPORT TRANSLATIONS
import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"
import { COUNTRY_COOKIE } from "@constants/global"
import createMiddleware from "next-intl/middleware"
import { routing } from "@i18n/routing"
import {
  NEXT_LOCALE_COOKIE,
  MEDUSA_LOCALE_COOKIE,
  DEFAULT_LOCALE,
} from "@constants/global"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "gr"

// Legacy URL suffixes from old PHP/static eshops — strip and 308 redirect
const LEGACY_SUFFIX = /\.(html?|php|aspx?)$/i

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

const localeMapCache = {
  localeMap: new Map<string, HttpTypes.StoreLocale>(),
  localesUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    // Return a default region map with Greece if no backend URL
    const defaultMap = new Map<string, HttpTypes.StoreRegion>()
    defaultMap.set("gr", { id: "default", name: "Greece" } as HttpTypes.StoreRegion)
    return defaultMap
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        next: {
          revalidate: 3600,
          tags: [`regions-${cacheId}`],
        },
        cache: "force-cache",
      })

      if (!response.ok) {
        const json = await response.json().catch(() => ({}))
        throw new Error(json.message || "Failed to fetch regions")
      }

      const { regions } = await response.json()

      if (!regions?.length) {
        // Return default if no regions found
        const defaultMap = new Map<string, HttpTypes.StoreRegion>()
        defaultMap.set("gr", { id: "default", name: "Greece" } as HttpTypes.StoreRegion)
        return defaultMap
      }

      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching regions from Medusa:", error)
      }
      // Return cached map if available, or default map
      if (regionMap.size > 0) {
        return regionMap
      }
      const defaultMap = new Map<string, HttpTypes.StoreRegion>()
      defaultMap.set("gr", { id: "default", name: "Greece" } as HttpTypes.StoreRegion)
      return defaultMap
    }
  }

  return regionMapCache.regionMap
}

async function getLocaleMap(cacheId: string) {
  const { localeMap, localesUpdated } = localeMapCache

  if (!BACKEND_URL) {
    return getDefaultLocaleMap()
  }

  if (
    !localeMap.keys().next().value ||
    localesUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      const { locales } = await fetch(`${BACKEND_URL}/store/locales`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        next: {
          revalidate: 3600,
          tags: [`locales-${cacheId}`],
        },
        cache: "force-cache",
      }).then(async (response) => {
        const json = await response.json()

        if (!response.ok) {
          throw new Error(json.message)
        }

        return json
      })

      if (!locales?.length || locales.length === 1) {
        return getDefaultLocaleMap()
      }

      locales.forEach((locale: HttpTypes.StoreLocale) => {
        const shortCode: any = locale.code.split("-")[0].toLowerCase()

        if (routing.locales.includes(shortCode)) {
          localeMapCache.localeMap.set(shortCode, locale)
        }
      })

      localeMapCache.localesUpdated = Date.now()
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching locales from Medusa:", error)
      }
      return getDefaultLocaleMap()
    }
  }

  return localeMapCache.localeMap
}

function getDefaultLocaleMap(): Map<string, HttpTypes.StoreLocale> {
  const defaultMap = new Map<string, HttpTypes.StoreLocale>()

  routing.locales.forEach((locale: any) => {
    let fullCode: string
    let name: string

    switch (locale) {
      case "el":
        fullCode = "el-GR"
        name = "Ελληνικά (Ελλάδα)"
        break
      case "en":
        fullCode = "en-US"
        name = "English (United States)"
        break
      default:
        fullCode = `${locale}-${locale.toUpperCase()}`
        name = locale.toUpperCase()
    }

    defaultMap.set(locale, { code: fullCode, name })
  })

  return defaultMap
}

async function getMedusaLocale(
  nextLocale: string,
  cacheId: string
): Promise<string> {
  const localeMap = await getLocaleMap(cacheId)
  const medusaLocale = localeMap.get(nextLocale)

  return medusaLocale?.code || `${nextLocale}-${nextLocale.toUpperCase()}`
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
) {
  try {
    const cookieCountry = request.cookies
      .get(COUNTRY_COOKIE)
      ?.value?.toLowerCase()

    if (cookieCountry && regionMap.has(cookieCountry)) {
      return cookieCountry
    }

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      return vercelCountryCode
    }

    if (regionMap.has(DEFAULT_REGION)) {
      return DEFAULT_REGION
    }

    return regionMap.keys().next().value
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error resolving country code", error)
    }
  }
}

const intlMiddleware = createMiddleware(routing)

/**
 * Determines the locale with proper priority:
 * 1. Check URL pathname for explicit locale
 * 2. Check NEXT_LOCALE cookie (set by next-intl)
 * 3. Fall back to default locale
 */
function determineCurrentLocale(
  request: NextRequest,
  pathname: string
): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale
    }
  }

  const cookieLocale: any = request.cookies.get(NEXT_LOCALE_COOKIE)?.value
  if (cookieLocale && routing.locales.includes(cookieLocale)) {
    return cookieLocale
  }

  return routing.defaultLocale
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ── 1. Strip legacy suffixes (.html, .htm, .php, .asp, .aspx) and 308 redirect ──
  if (LEGACY_SUFFIX.test(pathname)) {
    const cleaned = pathname.replace(LEGACY_SUFFIX, "") || "/"
    const url = request.nextUrl.clone()
    url.pathname = cleaned
    return NextResponse.redirect(url, 308)
  }

  // ── 2. Skip everything else with an extension on the LAST segment (assets) ──
  // Allows handles containing dots (e.g. /version-2.0/foo) to pass through.
  const lastSegment = pathname.split("/").pop() ?? ""
  if (lastSegment.includes(".")) {
    return NextResponse.next()
  }

  const response = intlMiddleware(request)

  const currentLocale = determineCurrentLocale(request, pathname)

  const existingNextLocaleCookie = request.cookies.get(NEXT_LOCALE_COOKIE)
  if (
    !existingNextLocaleCookie ||
    existingNextLocaleCookie.value !== currentLocale
  ) {
    response.cookies.set(NEXT_LOCALE_COOKIE, currentLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
  }

  let cacheIdCookie = request.cookies.get("_medusa_cache_id")
  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const existingMedusaLocaleCookie = request.cookies.get(MEDUSA_LOCALE_COOKIE)
  if (!existingMedusaLocaleCookie) {
    const medusaLocale = await getMedusaLocale(currentLocale, cacheId)
    response.cookies.set(MEDUSA_LOCALE_COOKIE, medusaLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    })
  } else {
    const expectedMedusaLocale = await getMedusaLocale(currentLocale, cacheId)
    if (existingMedusaLocaleCookie.value !== expectedMedusaLocale) {
      response.cookies.set(MEDUSA_LOCALE_COOKIE, expectedMedusaLocale, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      })
    }
  }

  const regionMap = await getRegionMap(cacheId)
  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  if (countryCode) {
    const existingCountryCookie = request.cookies.get(COUNTRY_COOKIE)

    if (!existingCountryCookie || existingCountryCookie.value !== countryCode) {
      response.cookies.set(COUNTRY_COOKIE, countryCode, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })
    }
  }

  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
      path: "/",
    })
  }

  return response
}

export const config = {
  // Excludes only Next.js internals and API routes.
  // Asset filtering is done inside the middleware via the last-segment check
  // so legacy .html/.php URLs can be redirected.
  matcher: ["/((?!api|_next|_vercel).*)"],
}

// //SUPPORT TRANSLATIONS
// import { HttpTypes } from "@medusajs/types"
// import { NextRequest, NextResponse } from "next/server"
// import { COUNTRY_COOKIE } from "@constants/global"
// import createMiddleware from "next-intl/middleware"
// import { routing } from "@i18n/routing"
// import {
//   NEXT_LOCALE_COOKIE,
//   MEDUSA_LOCALE_COOKIE,
//   DEFAULT_LOCALE,
// } from "@constants/global"
//
// const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
// const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
// const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "gr"
//
// const regionMapCache = {
//   regionMap: new Map<string, HttpTypes.StoreRegion>(),
//   regionMapUpdated: Date.now(),
// }
//
// const localeMapCache = {
//   localeMap: new Map<string, HttpTypes.StoreLocale>(),
//   localesUpdated: Date.now(),
// }
//
// async function getRegionMap(cacheId: string) {
//   const { regionMap, regionMapUpdated } = regionMapCache
//
//   if (!BACKEND_URL) {
//     throw new Error(
//       "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable?"
//     )
//   }
//
//   if (
//     !regionMap.keys().next().value ||
//     regionMapUpdated < Date.now() - 3600 * 1000
//   ) {
//     const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
//       headers: {
//         "x-publishable-api-key": PUBLISHABLE_API_KEY!,
//       },
//       next: {
//         revalidate: 3600,
//         tags: [`regions-${cacheId}`],
//       },
//       cache: "force-cache",
//     }).then(async (response) => {
//       const json = await response.json()
//
//       if (!response.ok) {
//         throw new Error(json.message)
//       }
//
//       return json
//     })
//
//     if (!regions?.length) {
//       throw new Error(
//         "No regions found. Please set up regions in your Medusa Admin."
//       )
//     }
//
//     regions.forEach((region: HttpTypes.StoreRegion) => {
//       region.countries?.forEach((c) => {
//         regionMapCache.regionMap.set(c.iso_2 ?? "", region)
//       })
//     })
//
//     regionMapCache.regionMapUpdated = Date.now()
//   }
//
//   return regionMapCache.regionMap
// }
//
// async function getLocaleMap(cacheId: string) {
//   const { localeMap, localesUpdated } = localeMapCache
//
//   if (!BACKEND_URL) {
//     return getDefaultLocaleMap()
//   }
//
//   if (
//     !localeMap.keys().next().value ||
//     localesUpdated < Date.now() - 3600 * 1000
//   ) {
//     try {
//       const { locales } = await fetch(`${BACKEND_URL}/store/locales`, {
//         headers: {
//           "x-publishable-api-key": PUBLISHABLE_API_KEY!,
//         },
//         next: {
//           revalidate: 3600,
//           tags: [`locales-${cacheId}`],
//         },
//         cache: "force-cache",
//       }).then(async (response) => {
//         const json = await response.json()
//
//         if (!response.ok) {
//           throw new Error(json.message)
//         }
//
//         return json
//       })
//
//       if (!locales?.length || locales.length === 1) {
//         return getDefaultLocaleMap()
//       }
//
//       locales.forEach((locale: HttpTypes.StoreLocale) => {
//         const shortCode: any = locale.code.split("-")[0].toLowerCase()
//
//         if (routing.locales.includes(shortCode)) {
//           localeMapCache.localeMap.set(shortCode, locale)
//         }
//       })
//
//       localeMapCache.localesUpdated = Date.now()
//     } catch (error) {
//       if (process.env.NODE_ENV === "development") {
//         console.error("Error fetching locales from Medusa:", error)
//       }
//       return getDefaultLocaleMap()
//     }
//   }
//
//   return localeMapCache.localeMap
// }
//
// function getDefaultLocaleMap(): Map<string, HttpTypes.StoreLocale> {
//   const defaultMap = new Map<string, HttpTypes.StoreLocale>()
//
//   routing.locales.forEach((locale: any) => {
//     let fullCode: string
//     let name: string
//
//     switch (locale) {
//       case "el":
//         fullCode = "el-GR"
//         name = "Ελληνικά (Ελλάδα)"
//         break
//       case "en":
//         fullCode = "en-US"
//         name = "English (United States)"
//         break
//       default:
//         fullCode = `${locale}-${locale.toUpperCase()}`
//         name = locale.toUpperCase()
//     }
//
//     defaultMap.set(locale, { code: fullCode, name })
//   })
//
//   return defaultMap
// }
//
// async function getMedusaLocale(
//   nextLocale: string,
//   cacheId: string
// ): Promise<string> {
//   const localeMap = await getLocaleMap(cacheId)
//   const medusaLocale = localeMap.get(nextLocale)
//
//   return medusaLocale?.code || `${nextLocale}-${nextLocale.toUpperCase()}`
// }
//
// async function getCountryCode(
//   request: NextRequest,
//   regionMap: Map<string, HttpTypes.StoreRegion>
// ) {
//   try {
//     const cookieCountry = request.cookies
//       .get(COUNTRY_COOKIE)
//       ?.value?.toLowerCase()
//
//     if (cookieCountry && regionMap.has(cookieCountry)) {
//       return cookieCountry
//     }
//
//     const vercelCountryCode = request.headers
//       .get("x-vercel-ip-country")
//       ?.toLowerCase()
//
//     if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
//       return vercelCountryCode
//     }
//
//     if (regionMap.has(DEFAULT_REGION)) {
//       return DEFAULT_REGION
//     }
//
//     return regionMap.keys().next().value
//   } catch (error) {
//     if (process.env.NODE_ENV === "development") {
//       console.error("Error resolving country code", error)
//     }
//   }
// }
//
// const intlMiddleware = createMiddleware(routing)
//
// /**
//  * Determines the locale with proper priority:
//  * 1. Check URL pathname for explicit locale
//  * 2. Check NEXT_LOCALE cookie (set by next-intl)
//  * 3. Fall back to default locale
//  */
// function determineCurrentLocale(
//   request: NextRequest,
//   pathname: string
// ): string {
//   for (const locale of routing.locales) {
//     if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
//       return locale
//     }
//   }
//
//   const cookieLocale: any = request.cookies.get(NEXT_LOCALE_COOKIE)?.value
//   if (cookieLocale && routing.locales.includes(cookieLocale)) {
//     return cookieLocale
//   }
//
//   return routing.defaultLocale
// }
//
// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname
//
//   if (pathname.includes(".")) {
//     return NextResponse.next()
//   }
//
//   const response = intlMiddleware(request)
//
//   const currentLocale = determineCurrentLocale(request, pathname)
//
//   const existingNextLocaleCookie = request.cookies.get(NEXT_LOCALE_COOKIE)
//   if (
//     !existingNextLocaleCookie ||
//     existingNextLocaleCookie.value !== currentLocale
//   ) {
//     response.cookies.set(NEXT_LOCALE_COOKIE, currentLocale, {
//       maxAge: 60 * 60 * 24 * 365, // 1 year
//       path: "/",
//     })
//   }
//
//   let cacheIdCookie = request.cookies.get("_medusa_cache_id")
//   let cacheId = cacheIdCookie?.value || crypto.randomUUID()
//
//   const existingMedusaLocaleCookie = request.cookies.get(MEDUSA_LOCALE_COOKIE)
//   if (!existingMedusaLocaleCookie) {
//     const medusaLocale = await getMedusaLocale(currentLocale, cacheId)
//     response.cookies.set(MEDUSA_LOCALE_COOKIE, medusaLocale, {
//       maxAge: 60 * 60 * 24 * 365, // 1 year
//       path: "/",
//     })
//   } else {
//     const expectedMedusaLocale = await getMedusaLocale(currentLocale, cacheId)
//     if (existingMedusaLocaleCookie.value !== expectedMedusaLocale) {
//       response.cookies.set(MEDUSA_LOCALE_COOKIE, expectedMedusaLocale, {
//         maxAge: 60 * 60 * 24 * 365,
//         path: "/",
//       })
//     }
//   }
//
//   const regionMap = await getRegionMap(cacheId)
//   const countryCode = regionMap && (await getCountryCode(request, regionMap))
//
//   if (countryCode) {
//     const existingCountryCookie = request.cookies.get(COUNTRY_COOKIE)
//
//     if (!existingCountryCookie || existingCountryCookie.value !== countryCode) {
//       response.cookies.set(COUNTRY_COOKIE, countryCode, {
//         maxAge: 60 * 60 * 24 * 30, // 30 days
//         path: "/",
//       })
//     }
//   }
//
//   if (!cacheIdCookie) {
//     response.cookies.set("_medusa_cache_id", cacheId, {
//       maxAge: 60 * 60 * 24,
//       path: "/",
//     })
//   }
//
//   return response
// }
//
// export const config = {
//   matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
// }
