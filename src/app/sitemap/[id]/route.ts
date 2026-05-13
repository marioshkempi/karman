// app/sitemap/[id]/route.ts
import { NextResponse } from "next/server"

const STORE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://yourstore.gr"
const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const PRODUCTS_PER_SITEMAP = 5000
const headers = {
  "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = Number(rawId.replace(".xml", ""))

  let entries: {
    url: string
    lastmod: string
    changefreq: string
    priority: number
  }[] = []

  if (id === 0) {
    entries = await buildNonProductSitemap()
  } else {
    const offset = (id - 1) * PRODUCTS_PER_SITEMAP
    entries = await buildProductSitemap(offset, PRODUCTS_PER_SITEMAP)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}

// ── Products ────────────────────────────────────────────────

async function buildProductSitemap(offset: number, limit: number) {
  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/products?limit=${limit}&offset=${offset}&fields=handle,updated_at`,
      { headers, next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()

    return (data.products ?? []).map(
      (p: { handle: string; updated_at: string }) => ({
        url: `${STORE_URL}/${p.handle}`,
        lastmod: new Date(p.updated_at).toISOString(),
        changefreq: "daily",
        priority: 0.8,
      })
    )
  } catch {
    return []
  }
}

// ── Non-products ────────────────────────────────────────────

async function buildNonProductSitemap() {
  const entries: {
    url: string
    lastmod: string
    changefreq: string
    priority: number
  }[] = []

  for (const { path, priority } of [
    { path: "", priority: 1.0 },
    { path: "/blog", priority: 0.7 },
    { path: "/contact-us", priority: 0.7 },
  ]) {
    entries.push({
      url: `${STORE_URL}${path}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority,
    })
  }

  const [categories, collections, pages, blogPosts] = await Promise.all([
    fetchPaginated(
      "/store/product-categories",
      "product_categories",
      500,
      "handle,updated_at"
    ),
    fetchPaginated(
      "/store/collections",
      "collections",
      500,
      "handle,updated_at"
    ),
    fetchPages(),
    fetchPaginated("/store/blog", "blog_posts", 100, "handle,updated_at"),
  ])

  for (const cat of categories) {
    entries.push({
      url: `${STORE_URL}/${cat.handle}`,
      lastmod: new Date(cat.updated_at).toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    })
  }
  for (const col of collections) {
    entries.push({
      url: `${STORE_URL}/collections/${col.handle}`,
      lastmod: new Date(col.updated_at).toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    })
  }
  for (const page of pages) {
    entries.push({
      url: `${STORE_URL}/${page.handle}`,
      lastmod: new Date(page.updated_at).toISOString(),
      changefreq: "weekly",
      priority: 0.6,
    })
  }
  for (const post of blogPosts) {
    entries.push({
      url: `${STORE_URL}/blog/${post.handle}`,
      lastmod: new Date(post.updated_at).toISOString(),
      changefreq: "weekly",
      priority: 0.6,
    })
  }

  return entries
}

// ── Helpers ─────────────────────────────────────────────────

async function fetchPaginated(
  endpoint: string,
  key: string,
  limit: number,
  fields?: string
): Promise<{ handle: string; updated_at: string }[]> {
  try {
    const results: { handle: string; updated_at: string }[] = []
    let offset = 0
    let hasMore = true

    while (hasMore) {
      let url = `${MEDUSA_URL}${endpoint}?limit=${limit}&offset=${offset}`
      if (fields) url += `&fields=${fields}`

      const res = await fetch(url, { headers, next: { revalidate: 3600 } })
      if (!res.ok) break
      const data = await res.json()
      results.push(...(data[key] ?? []))
      offset += limit
      hasMore = offset < (data.count ?? 0)
    }

    return results
  } catch {
    return []
  }
}

async function fetchPages(): Promise<{ handle: string; updated_at: string }[]> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/pages?limit=500&offset=0`, {
      headers,
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.pages ?? []
  } catch {
    return []
  }
}
