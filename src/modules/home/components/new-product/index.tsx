import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { ProductSlider } from "../new-product-slider"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function ProductShowCase({ 
  products,
  region,
  title,
  viewAllLink
}: {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  title?: string
  viewAllLink?: string
}) {
  if (!products || products.length === 0) {
    return null
  }
  
  return (
    <div className="w-full bg-white py-10 lg:py-14">
      <div className="max-w-[1350px] mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 lg:mb-8">
          <div>
            <h2 className="text-xl lg:text-2xl text-gray-900 font-bold tracking-tight">
              {title}
            </h2>
            {viewAllLink && (
              <LocalizedClientLink 
                href={viewAllLink}
                className="text-xs lg:text-sm text-gray-500 hover:text-gray-700 uppercase tracking-wider mt-1 inline-block"
              >
                VIEW ALL
              </LocalizedClientLink>
            )}
          </div>
        </div>

        <ProductSlider>
          {products.map((product) => (
            <ProductPreview
              key={product.id}
              product={product}
              region={region}
              separatedButtonOnMobile={true}
            />
          ))}
        </ProductSlider>
      </div>
    </div>
  )
}
