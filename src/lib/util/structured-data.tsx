// lib/structured-data.tsx

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={
        {
          __html: JSON.stringify(data),
        }
      }
    />
  )
}

export function buildProductSchema(product: any, siteUrl: string) {
  const variant = product.variants?.[0]
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.subtitle || product.title,
    image: product.thumbnail,
    sku: variant?.sku,
    mpn: variant?.sku,
    brand: product.metadata?.brand
      ? { "@type": "Brand", name: product.metadata.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: variant?.calculated_price?.calculated_amount,
      availability:
        variant?.inventory_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${siteUrl}/${product.handle}`,
    },
  }
}

export function buildCategorySchema(category: any, handle: string, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description ?? `${category.name} category.`,
    url: `${siteUrl}/${handle}`,
  }
}

export function buildPageSchema(page: any, handle: string, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title || page.name,
    description: page.content?.slice(0, 160),
    url: `${siteUrl}/${handle}`,
  }
}