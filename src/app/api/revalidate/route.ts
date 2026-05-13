// src/app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

const SECRET = process.env.REVALIDATION_SECRET
const LOCALES = ["el", "en"]

const SITE_SETTING_KEYS = [
  "header_logo",
  "footer_logo",
  "email_logo",
  "captcha_site_key",
  "new_product_threshold",
  "products_per_page",
  "site_favicon",
  "ga_measurement_id",
  "gtm_id",
  "fb_pixel_id",
  "B2B_CUSTOMER_GROUP_ID",
  "show_brands_without_products",
  "default_offers_category_id",
  "home_page_show_new_products",
  "home_page_show_popular_products",
  "home_page_show_offers_products",
  "home_page_show_best_sellers",
  "home_page_show_featured_products",
  "home_page_show_popular_categories",
  "home_page_show_brands",
  "home_page_show_blogs",
  "allowed_ips",
  "maintenance_mode",
]

// ── SSG pages (● in build output) ──────────────────────────────────────────
const SSG_PATHS = [
  "", // /[locale]
  "/about-us",
  "/account",
  "/account/addresses",
  "/account/bulk-orders",
  "/account/coupons",
  "/account/orders",
  "/account/profile",
  "/account/wishlist",
  "/antallaktika",
  "/best-selling",
  "/blog",
  "/blogs",
  "/brands",
  "/cart",
  "/checkout",
  "/checkout/piraeus-bank/failure",
  "/checkout/piraeus-bank/success",
  "/checkout/piraeus-bank/validate",
  "/contact-us",
  "/my-garage",
  "/offers",
  "/popular-products",
  "/search",
  "/store",
  "/store-locator",
  "/track-order",
  "/wholeseller-customer",
  "/wishlist",
]

// ── Dynamic pages (ƒ in build output) ──────────────────────────────────────
// These require "page" type when calling revalidatePath
const DYNAMIC_PATHS = [
  "/[...handle]", // product/category pages
  "/blog/[id]",
  "/blogs/[handle]",
  "/brands/[...handle]",
  "/collections/[handle]",
  "/account/orders/details/[id]",
  "/order/[id]/confirmed",
  "/order/[id]/transfer/[token]",
  "/order/[id]/transfer/[token]/accept",
  "/order/[id]/transfer/[token]/decline",
]

// ── Helpers ────────────────────────────────────────────────────────────────

const revalidateAllSSG = () => {
  LOCALES.forEach((locale) => {
    SSG_PATHS.forEach((p) => revalidatePath(`/${locale}${p}`))
  })
}

const revalidateAllDynamic = () => {
  LOCALES.forEach((locale) => {
    DYNAMIC_PATHS.forEach((p) => {
      revalidatePath(`/${locale}${p}`, "page")
    })
  })
}

const revalidateAllLayouts = () => {
  LOCALES.forEach((locale) => {
    revalidatePath(`/${locale}`, "layout")
  })
}

const revalidateAllTags = () => {
  revalidateTag("products")
  revalidateTag("collections")
  revalidateTag("categories")
  revalidateTag("regions")
  revalidateTag("price-lists")
  revalidateTag("brands")
  revalidateTag("blogs")
  revalidateTag("pages")
  revalidateTag("sliders")
  revalidateTag("orders")
  revalidateTag("mega-menu")
  revalidateTag("blogs")
  revalidateTag("blog")
  revalidateTag("page")
  revalidateTag("pages")
  SITE_SETTING_KEYS.forEach((key) => {
    revalidateTag(`${key}`)
  })
}

const revalidateEverything = () => {
  revalidateAllTags()
  revalidateAllSSG()
  revalidateAllDynamic()
  revalidateAllLayouts()
}

// Revalidate specific SSG paths across all locales
const revalidateSSGPaths = (...paths: string[]) => {
  LOCALES.forEach((locale) => {
    paths.forEach((p) => revalidatePath(`/${locale}${p}`))
  })
}

// Revalidate specific dynamic paths across all locales
const revalidateDynamicPaths = (...paths: string[]) => {
  LOCALES.forEach((locale) => {
    paths.forEach((p) => revalidatePath(`/${locale}${p}`, "page"))
  })
}

// ── POST handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  if (searchParams.get("secret") !== SECRET) {
    console.warn("[Revalidate] Unauthorized request")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { type, data } = body

  try {
    switch (type) {
      case "all":
        revalidateEverything()
        break

      case "product.updated":
      case "product.created":
        revalidateTag("products")
        revalidateDynamicPaths("/[...handle]")
        revalidateSSGPaths(
          "",
          "/store",
          "/search",
          "/offers",
          "/best-selling",
          "/popular-products",
          "/antallaktika"
        )
        break

      case "product.deleted":
        revalidateTag("products")
        revalidateDynamicPaths("/[...handle]")
        revalidateSSGPaths("", "/store", "/search")
        break

      case "product-category.updated":
        revalidateTag("categories")
        revalidateDynamicPaths("/[...handle]")
        revalidateSSGPaths("", "/store", "/antallaktika")
        break

      case "product-collection.updated":
        revalidateTag("collections")
        revalidateDynamicPaths("/collections/[handle]")
        revalidateSSGPaths("")
        break

      case "region.updated":
        revalidateTag("regions")
        revalidateTag("products")
        revalidateEverything()
        break

      case "price-list.updated":
        revalidateTag("price-lists")
        revalidateTag("products")
        revalidateDynamicPaths("/[...handle]")
        revalidateSSGPaths("", "/store", "/offers", "/best-selling")
        break

      case "site-setting.updated": {
        const key = data?.key
        if (key && SITE_SETTING_KEYS.includes(key)) {
          revalidateTag(`${key}`)
        } else {
          SITE_SETTING_KEYS.forEach((k) => revalidateTag(`${k}`))
        }
        revalidateAllLayouts()
        revalidateSSGPaths("")
        break
      }

      default:
        //console.log(`[Revalidate] Unknown type "${type}" — full revalidation`)
        revalidateEverything()
    }

    //console.log("[Revalidate] ✅ Done:", type)
    return NextResponse.json({
      revalidated: true,
      type,
      timestamp: Date.now(),
    })
  } catch (err) {
    console.error("[Revalidate] ❌ Error:", err)
    return NextResponse.json(
      { message: "Revalidation failed" },
      { status: 500 }
    )
  }
}

// ── GET handler (manual full revalidation) ─────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  revalidateEverything()

  //console.log("[Revalidate] ✅ Full revalidation complete")
  return NextResponse.json({ revalidated: true, timestamp: Date.now() })
}
