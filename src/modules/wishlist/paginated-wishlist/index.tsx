import { getRegion } from "@lib/data/regions"
import { listProductsWithSort } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Wishlist } from "@lib/data/wishlist"

const PRODUCT_LIMIT = 12

export default async function PaginatedWishlistProducts({
  wishlist,
  sortBy,
  page,
  countryCode,
}: {
  wishlist: Wishlist
  sortBy?: SortOptions
  page: number
  countryCode: string
}) {
  // @ts-ignore
  const variantIds = wishlist.items.map((item) => item.variant_id)

  if (variantIds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Your wishlist is empty</p>
      </div>
    )
  }

  const region = await getRegion()

  if (!region) {
    return null
  }
  //console.log(wishlist)
  const productIds = wishlist.items
    .map((item) => item.product_variant?.product_id)
    .filter((id) => id)

  const queryParams = {
    limit: PRODUCT_LIMIT,
    id: productIds,
  }

  if (sortBy === "created_at") {
    // @ts-ignore
    queryParams["order"] = "created_at"
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul className="grid grid-cols-2 w-full lg:grid-cols-3 gap-x-3 gap-y-8">
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview
              product={p}
              region={region}
              countryCode={countryCode}
            />
          </li>
        ))}
      </ul>
      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
    </>
  )
}
