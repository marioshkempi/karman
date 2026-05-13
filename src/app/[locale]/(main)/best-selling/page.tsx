import { Metadata } from "next"
import BestSellingTemplate from "@modules/best-selling/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getBestSellingProducts } from "@lib/data/analytics"

type Props = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Best Selling Products",
    description: "Discover our most popular and best-selling products",
    alternates: {
      canonical: "best-selling",
    },
  }
}

export default async function BestSellingPage(props: Props) {
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  const { top_products, total_count } = await getBestSellingProducts()

  return (
    <BestSellingTemplate
      sortBy={sortBy}
      page={page}
      productCount={total_count}
    />
  )
}
