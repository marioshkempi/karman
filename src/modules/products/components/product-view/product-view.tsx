"use client"

import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { useCategoryViewStore } from "../../../../global-states/use-category-view"
import ProductPreviewList from "@modules/products/components/product-preview/product-preview-list"

type Props = {
  products: any[]
  region: HttpTypes.StoreRegion
  countryCode?: string
  isNewMap: Record<string, boolean>
  tracking?: any
  discountMap?: Record<string, any>
}

export default function ProductView({
  products,
  region,
  countryCode,
  isNewMap,
  tracking,
  discountMap,
}: Props) {
  const { viewMode } = useCategoryViewStore()

  if (viewMode === "list") {
    return (
      <ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full gap-3"
        data-testid="products-list"
      >
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreviewList
              product={p}
              region={region}
              countryCode={countryCode}
              isNew={isNewMap[p.id] ?? false}
              tracking={tracking}
              discount={discountMap?.[p.external_id] ?? null}
            />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul
      className="grid grid-cols-2 w-full lg:grid-cols-3 gap-x-4 gap-y-6"
      data-testid="products-list"
    >
      {products.map((p) => (
        <li key={p.id}>
          <ProductPreview
            product={p}
            region={region}
            countryCode={countryCode}
            isNew={isNewMap[p.id] ?? false}
            tracking={tracking}
            discount={discountMap?.[p.external_id] ?? null}
          />
        </li>
      ))}
    </ul>
  )
}
