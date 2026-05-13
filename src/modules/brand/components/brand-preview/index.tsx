import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type Brand = {
  image_url?: string
  name: string
  count: number
  handle: string
  product_count: number
}

export default function BrandPreview({ brand }: { brand: Brand }) {
  const hasImage = brand.image_url && brand.image_url.trim() !== ""

  return (
    <LocalizedClientLink
      href={`/brands/${brand.handle}`}
      className="group block"
    >
      <div className="bg-white rounded-lg transition-shadow duration-200">
        <div className="relative w-full aspect-square flex items-center justify-center p-8 bg-white border border-gray-200 rounded-t-lg">
          {hasImage ? (
            <Image
              src={brand.image_url}
              alt={brand.name}
              width={200}
              height={200}
              className="object-contain w-full h-full transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-4 py-3 text-center bg-gray-50 rounded-b-lg">
          <h3
            className="font-medium text-gray-900 mb-1"
            style={{ fontSize: "13px" }}
          >
            {brand.name}
          </h3>
          <p className="text-gray-500" style={{ fontSize: "13px" }}>
            ( {brand.product_count} )
          </p>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
