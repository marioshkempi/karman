import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import BrandTemplate from "@modules/brand/templates"
import { getPaginatedBrands } from "@services/typesense/typesenseService"
import Reassurances from "@modules/common/components/reassurances"
import { getProductsPerPage } from "@lib/data/site-settings"
import { getPageSeo, toNextMetadata } from "@lib/data/seo"
import { JsonLd } from "@lib/util/structured-data"

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("brands")

  return toNextMetadata(seo, {
    title: "Μάρκες",
    description: "Explore all of our Brands.",
  })
}

export default async function BrandPage(props: Params) {
  const params = await props.params
  const { countryCode } = params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  const pageNumber = page ? parseInt(page) : 1
  const perPage = await getProductsPerPage()

  const [brandsData, seo] = await Promise.all([
    getPaginatedBrands(pageNumber, perPage),
    getPageSeo("brands"),
  ])

  return (
    <>
      {seo?.structured_data && <JsonLd data={seo.structured_data} />}
      <BrandTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        brandsData={brandsData}
      />
      <Reassurances language={countryCode} page_type="home" />
    </>
  )
}
