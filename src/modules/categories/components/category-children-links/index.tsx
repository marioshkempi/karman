import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

interface CategoryChildrenLinksProps {
  children: HttpTypes.StoreProductCategory[]
  basePath?: string
}

export default function CategoryChildrenLinks({
  children,
  basePath = "/categories",
}: CategoryChildrenLinksProps) {
  if (!children || children.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {children.map((category) => (
          <LocalizedClientLink
            key={category.id}
            href={`${basePath}/${category.handle}`}
            className="inline-block px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-lg  text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200 sm:text-sm hover:bg-primary hover:text-white"
          >
            {category.name}
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}