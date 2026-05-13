// app/sitemap.xml/route.ts
import { NextResponse } from "next/server"

const STORE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://yourstore.gr"
const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const PRODUCTS_PER_SITEMAP = 5000

export async function GET() {
  const sitemaps = [`${STORE_URL}/sitemap/0.xml`]

  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/products?limit=1&offset=0&fields=id`,
      {
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        next: { revalidate: 3600 },
      }
    )
    if (res.ok) {
      const data = await res.json()
      const totalProducts = data.count ?? 0
      const chunks = Math.ceil(totalProducts / PRODUCTS_PER_SITEMAP)
      for (let i = 1; i <= chunks; i++) {
        sitemaps.push(`${STORE_URL}/sitemap/${i}.xml`)
      }
    }
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
