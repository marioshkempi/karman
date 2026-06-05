import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { ProductSlider } from "../new-product-slider"
import Link from "next/link"

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

  const tabs = ["Λάμπες", "Αρωματικά", "Καλύμματα"]

  return (
    <div className="w-full bg-white mb-12 lg:mb-20">
      <div className="max-w-[1350px] mx-auto px-4">
        {/* Header with title, tabs, and link */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
            <h2 className="text-[20px] lg:text-[30px] text-primary font-medium">
              Δημοφιλή προϊόντα
            </h2>
            <div className="flex items-center gap-4">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className="text-[14px] lg:text-[16px] text-gray-600 font-medium hover:text-[#94A3B8] transition-colors"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <Link 
            href="/products" 
            className="text-[14px] text-primary font-medium hover:underline mt-2 lg:mt-0"
          >
            Δείτε περισσότερα
          </Link>
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
