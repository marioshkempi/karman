import { Metadata } from "next"
import { cookies } from "next/headers"
import { sdk } from "@lib/config"
import { NEXT_LOCALE_COOKIE } from "@constants/global"
import { getSiteSettings } from "@lib/data/site-settings"
import { getSimpleCacheOptions } from "@lib/data/cookies"

const DEFAULT_LOCALE = "el"

export type SeoPageData = {
  id: string
  page_key: string
  locale: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  og_type: string
  twitter_card: string
  twitter_title: string | null
  twitter_description: string | null
  twitter_image: string | null
  canonical_url: string | null
  robots: string
  structured_data: Record<string, any> | null
  is_active: boolean
}

/**
 * Get current locale from cookie, falling back to DEFAULT_LOCALE.
 */
async function getLocaleFromCookie(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get(NEXT_LOCALE_COOKIE)?.value || DEFAULT_LOCALE
}

/**
 * Fetch SEO metadata for a single page.
 * Reads locale from NEXT_LOCALE cookie automatically if not provided.
 */
export async function getPageSeo(
  pageKey: string,
  locale?: string
): Promise<SeoPageData | null> {
  const resolvedLocale = locale || (await getLocaleFromCookie())

  try {
    const data = await sdk.client.fetch<{ seo_page: SeoPageData }>(
      `/store/seo-pages/${pageKey}/${resolvedLocale}`,
      {
        method: "GET",
        next: getSimpleCacheOptions("seo"),
        // query: { locale: resolvedLocale },
        // next: {
        //   revalidate: 300,
        //   tags: [`seo-${pageKey}`, `seo-${pageKey}-${resolvedLocale}`],
        // },
      }
    )
    return data.seo_page || null
  } catch {
    return null
  }
}

/**
 * Fetch SEO for multiple pages in a single request.
 * Reads locale from NEXT_LOCALE cookie automatically if not provided.
 */
export async function getPageSeoBatch(
  pageKeys: string[],
  locale?: string
): Promise<Record<string, SeoPageData>> {
  const resolvedLocale = locale || (await getLocaleFromCookie())

  try {
    const data = await sdk.client.fetch<{ seo_pages: SeoPageData[] }>(
      `/store/seo-pages/batch`,
      {
        method: "POST",
        body: { page_keys: pageKeys, locale: resolvedLocale },
        next: {
          revalidate: 300,
          tags: ["seo-batch", ...pageKeys.map((k) => `seo-${k}`)],
        },
      }
    )

    const map: Record<string, SeoPageData> = {}
    for (const page of data.seo_pages || []) {
      map[page.page_key] = page
    }
    return map
  } catch {
    return {}
  }
}

/**
 * Convert SeoPageData to Next.js Metadata object.
 */
export function toNextMetadata(
  seo: SeoPageData | null,
  fallback?: {
    title?: string
    description?: string
    image?: string
    canonical?: string
    ogType?: string
  }
): Metadata {
  const title = seo?.meta_title || fallback?.title || ""
  const description = seo?.meta_description || fallback?.description || ""

  const metadata: Metadata = { title, description }

  if (seo?.meta_keywords) {
    metadata.keywords = seo.meta_keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
  }

  if (seo?.robots) {
    const parts = seo.robots.split(",").map((r) => r.trim().toLowerCase())
    metadata.robots = {
      index: !parts.includes("noindex"),
      follow: !parts.includes("nofollow"),
    }
  }

  const canonical = seo?.canonical_url || fallback?.canonical
  if (canonical) {
    metadata.alternates = { canonical }
  }

  const ogTitle = seo?.og_title || title
  const ogDescription = seo?.og_description || description
  const ogImage = seo?.og_image || fallback?.image

  metadata.openGraph = {
    title: ogTitle,
    description: ogDescription,
    type: (seo?.og_type as any) || fallback?.ogType || "website",
    ...(ogImage ? { images: [{ url: ogImage, alt: ogTitle }] } : {}),
  }

  const twitterImage = seo?.twitter_image || ogImage
  metadata.twitter = {
    card: (seo?.twitter_card as any) || "summary_large_image",
    title: seo?.twitter_title || ogTitle,
    description: seo?.twitter_description || ogDescription,
    ...(twitterImage ? { images: [twitterImage] } : {}),
  }

  return metadata
}
