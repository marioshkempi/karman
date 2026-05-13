import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getPageSeo, toNextMetadata } from "@lib/data/seo"
import { JsonLd } from "@lib/util/structured-data"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const [seo, t] = await Promise.all([getPageSeo("search"), getTranslations()])

  return toNextMetadata(seo, {
    title: t("store.search"),
    description: "Search for products.",
  })
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
    // @ts-ignore
    min_price?: number
    // @ts-ignore
    max_price?: number
    brand?: string
    categories_searchable?: string[]
    variant_option_ids?: string[]
    [key: string]: string | string[] | undefined
  }>
  params: Promise<{}>
}

export default async function SearchPage(props: Params) {
  const [searchParamsRaw, seo] = await Promise.all([
    props.searchParams,
    getPageSeo("search"),
  ])

  const filters: Record<string, string | string[]> = {}
  Object.keys(searchParamsRaw).forEach((key) => {
    const value = searchParamsRaw[key]
    if (value !== undefined && value !== null) {
      filters[key] = Array.isArray(value) ? value : [String(value)]
    }
  })

  return (
    <>
      {seo?.structured_data && <JsonLd data={seo.structured_data} />}
      <StoreTemplate
        // @ts-ignore
        sortBy={filters.sortBy ? String(filters.sortBy[0]) : undefined}
        page={filters.page ? String(filters.page[0]) : undefined}
        s={filters.q ? String(filters.q[0]) : undefined}
        searchParams={filters} // <-- pass the full filters object
        min_price={filters.min_price ? Number(filters.min_price[0]) : 0}
        max_price={filters.max_price ? Number(filters.max_price[0]) : 0}
        brand={filters.brand ? String(filters.brand[0]) : undefined}
      />
    </>
  )
}
