import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"
import ProductShowCase from "@modules/home/components/new-product"
import ProductPreview from "../product-preview"
import { ProductSlider } from "@modules/home/components/new-product-slider"
import {
  getRelatedProducts,
  getSameCategoryProducts,
} from "@services/typesense/typesenseService"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode?: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion()

  if (!region) {
    return null
  }

  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  const categories = product.categories ?? []

  const leafCategoryIds = (() => {
    const parentIds = new Set(
      categories.map((c) => c.parent_category_id).filter(Boolean)
    )
    return categories.filter((c) => !parentIds.has(c.id)).map((c) => c.id)
  })()

  if (!leafCategoryIds.length) return null

  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false
  const products: any = await getRelatedProducts(
    product.metadata?.related_ids as any
  )
  // const products = await getSameCategoryProducts(
  //   leafCategoryIds,
  //   product.id,
  //   1,
  //   12,
  //   "created_at:desc"
  // )

  if (!products.products.length) return null
  return (
    <div className="w-full bg-white mb-8 lg:mb-10 mt-10">
      <div className="max-w-[1350px] mx-auto px-4">
        <h2 className="text-[20px] lg:text-[30px] text-primary font-medium mb-4 mt-4 lg:mb-5">
          Σχετικά Προϊόντα
        </h2>

        <ProductSlider>
          {products.products.map((product: any) => (
            <ProductPreview
              key={product.id}
              product={product}
              region={region}
              isNew={product.isNew}
            />
          ))}
        </ProductSlider>
      </div>
    </div>
  )
}
