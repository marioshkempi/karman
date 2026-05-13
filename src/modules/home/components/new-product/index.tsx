import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { ProductSlider } from "../new-product-slider"

export default async function ProductShowCase({ 
  products,
  region,
  title
}: {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion,
  title?: string
}) {
  if (!products || products.length === 0) {
    return null
  }
  return (
    <div className="w-full bg-white mb-12 lg:mb-20">
      <div className="max-w-[1350px] mx-auto px-4">
        <h2 className="text-[20px] lg:text-[30px] text-primary font-medium mb-4 lg:mb-5">
          {title}
        </h2>

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