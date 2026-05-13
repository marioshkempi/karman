import { getProductsOnSale } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"

const PRODUCT_LIMIT = 12

export default async function PaginatedOffers({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  countryCode: string
}) {
  const region = await getRegion()

  if (!region) {
    return null
  }

  const {
    response: { products, count },
  } = await getProductsOnSale({
    sortBy,
    page,
    countryCode,
    queryParams: {
      limit: PRODUCT_LIMIT,
    },
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full lg:grid-cols-3 gap-x-3 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
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

