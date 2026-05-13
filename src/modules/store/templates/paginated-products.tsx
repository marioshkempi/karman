import { isNewProduct } from "@lib/util/is-new-product"
import { getRegion } from "@lib/data/regions"
import { Pagination } from "@modules/store/components/pagination"
import SortProducts, {
  SortOptions,
} from "@modules/store/components/refinement-list/sort-products"
import NotFoundData from "@modules/common/components/not-found-data"
import { getSiteSetting } from "@lib/data/site-settings"
import ProductListHeader from "@modules/store/components/product-list-header"
import ProductView from "@modules/products/components/product-view/product-view"
import { getTrackingSettings } from "@lib/data/tracking-scripts"
import { getProductDiscountsBatch } from "@lib/data/products"

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  s?: string
}

export default async function PaginatedProducts({
  limit = 12,
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  s,
  typeSenseProducts,
}: {
  limit: number
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode?: string
  s?: string
  typeSenseProducts?: { products: any[]; count: number }
}) {
  const tracking = await getTrackingSettings()

  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion()
  const newProductThreshold = await getSiteSetting("new_product_threshold")
  const thresholdDays = Number(newProductThreshold || 0)

  if (!region) {
    return null
  }

  let products: any[] = []
  let count: number = 0

  if (typeSenseProducts && typeSenseProducts.products?.length > 0) {
    products = typeSenseProducts.products
    count = typeSenseProducts.count
  } else {
  }

  if (products.length === 0) {
    return (
      <NotFoundData
        title="Δεν βρέθηκαν προϊοντα"
        description="Τα προϊοντα που ψάχνετε δεν υπάρχουν ή δεν έχουν δημιουργηθεί ακόμα."
        linkText="Πήγαινε στην αρχική"
        linkHref="/"
      />
    )
  }

  const totalPages = Math.ceil(count / limit)

  // Pre-compute isNew map
  const isNewMap: Record<string, boolean> = {}
  for (const p of products) {
    isNewMap[p.id] = isNewProduct(p.created_at, thresholdDays)
  }

  // Build batch products array with correct IDs
  const batchProducts = products
    .filter((p) => p.external_id)
    .map((p) => {
      const meta =
        typeof p.metadata === "string" ? JSON.parse(p.metadata) : p.metadata
      return {
        id_product: meta?.id_product,
        product_key: p.external_id,
      }
    })
    .filter((p) => p.id_product && p.product_key)

  let discountMap: Record<string, any> = {}

  if (batchProducts.length > 0) {
    try {
      const batchResult: any = await getProductDiscountsBatch(batchProducts)

      if (batchResult?.status === "ok" && Array.isArray(batchResult.rules)) {
        for (const rule of batchResult.rules) {
          if (rule.product_key) {
            discountMap[rule.product_key] = rule
          }
        }
      }
    } catch {
      // Discounts are non-critical — continue without them
    }
  }

  return (
    <>
      <ProductListHeader />
      <ProductView
        products={products}
        region={region}
        countryCode={countryCode}
        isNewMap={isNewMap}
        tracking={tracking}
        discountMap={discountMap}
      />
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
