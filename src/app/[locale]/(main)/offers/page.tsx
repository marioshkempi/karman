import { Metadata } from "next"
import OffersTemplate from "@modules/offers/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getProductsOnSale } from "@lib/data/products"
import { cookies } from "next/headers"
import { COUNTRY_COOKIE } from "@constants/global"

type Props = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Offers",
    description: "Discover our special offers and discounted products",
    alternates: {
      canonical: "offers",
    },
  }
}

export default async function OffersPage(props: Props) {
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  // ✅ Country from cookie
  const countryCode =await cookies()
    .get(COUNTRY_COOKIE)
    ?.value?.toLowerCase()

  const {
    response: { count },
  } = await getProductsOnSale({
    page: Number(page) || 1,
    countryCode, // ✅ cookie-based
    queryParams: {
      limit: 1,
    },
  })

  return (
    <OffersTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      productCount={count}
    />
  )
}
