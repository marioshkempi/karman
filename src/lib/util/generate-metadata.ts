import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export async function getCategoryMetadata(
  handle: string[]
): Promise<Metadata> {
  const category = await getCategoryByHandle(handle)
  if (!category) notFound()

  const title = category.name
  const description =
    category.description ?? `${title} category.`

  return {
    title,
    description,
    alternates: {
      canonical: `/${handle.join("/")}`,
    },
  }
}


export async function getProductMetadata(
  handle: string
): Promise<Metadata> {
  // @ts-ignore
  const product = await listProducts({
    // @ts-ignore
    queryParams: { handle },
  }).then(r => r.response.products[0])

  if (!product) notFound()

  return {
    title: product.title,
    description: product.subtitle ?? product.title,
    alternates: {
      canonical: `/${handle}`,
    },
    openGraph: {
      title: product.title,
      description: product.subtitle ?? product.title,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export function getPageMetadata(page: any): Metadata {
  return {
    title: page.title || page.name,
    description: page.content?.substring(0, 160),
    alternates: {
      canonical: `/${page.handle}`,
    },
  }
}