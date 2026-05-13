import { getBestSellingProducts } from "@lib/data/analytics"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"

const PRODUCT_LIMIT = 12

export default async function PaginatedTopSellingProducts({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  countryCode?: string
}) {
  const region = await getRegion()

  if (!region) {
    return null
  }

  const { top_products, total_count } = await getBestSellingProducts()

  let products = top_products

  if (sortBy && sortBy !== "created_at") {
    products = [...top_products].sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return (a.variants?.[0]?.calculated_price?.calculated_amount || 0) -
                 (b.variants?.[0]?.calculated_price?.calculated_amount || 0)
        case "price_desc":
          return (b.variants?.[0]?.calculated_price?.calculated_amount || 0) -
                 (a.variants?.[0]?.calculated_price?.calculated_amount || 0)
        default:
          return 0
      }
    })
  }

  const startIndex = (page - 1) * PRODUCT_LIMIT
  const endIndex = startIndex + PRODUCT_LIMIT
  const paginatedProducts = products.slice(startIndex, endIndex)

  const totalPages = Math.ceil(total_count / PRODUCT_LIMIT)

  //console.log(paginatedProducts, "paginatedProducts")

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full lg:grid-cols-3 gap-x-3 gap-y-8"
        data-testid="products-list"
      >
        {paginatedProducts.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}