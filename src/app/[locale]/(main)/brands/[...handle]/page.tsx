import { Metadata } from "next"
import NewsletterSignup from "@modules/home/components/newsletter"
import BrandViewTemplate from "@modules/brand/view-template"
import { retrieveBrandByHandle } from "@lib/data/brands"
import { brandGetProducts } from "@services/typesense/typesenseService"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { notFound } from "next/navigation"
import { getProductsPerPage } from "@lib/data/site-settings"

export const metadata: Metadata = {
  title: "Brands",
  description: "Explore our blog posts.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: number
    brand?: string
    features?: string | string[]
    min_price?: string | string[]
    max_price?: string | string[]
    option?: string | string[]
  }>
  params: Promise<{
    
    handle: string
    page?: string
  }>
}

export default async function BrandPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { page, sortBy } = searchParams
  const sort = sortBy || "created_at"
  // Fetch the brand
  const brand: any = await retrieveBrandByHandle(params.handle as string)
  const productsPerPage = await getProductsPerPage()

  const filters: Record<string, string | string[]> = {}
  Object.keys(searchParams as any).forEach((key: any) => {
    // @ts-ignore
    const value: any = searchParams[key]
    if (value !== undefined && value !== null) {
      filters[key] = Array.isArray(value) ? value : [String(value)]
    }
  })

  if (!brand) return notFound()

  const brandProducts = await brandGetProducts(
    brand.id,
    page,
    productsPerPage,
    sort,
    filters,
    searchParams.min_price ? Number(searchParams.min_price[0]) : 0,
    searchParams.max_price ? Number(searchParams.max_price[0]) : 0
  )

  return (
    <>
      {brand ? (
        <BrandViewTemplate
          limit={productsPerPage}
          brand={brand}
          sortBy={sort}
          page={page}
          countryCode={params.countryCode}
          brandProducts={brandProducts}
        />
      ) : (
        <p>Brand not found.</p>
      )}
      {/*<SocialFollowSection />*/}
      <NewsletterSignup />
    </>
  )
}
