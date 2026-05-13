import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import Breadcrumb from "@modules/common/components/breadcrumb"
import PageTitle from "@modules/common/components/PageTitle"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  productCount,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  productCount?: number
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...parents.reverse().map(parent => ({
      label: parent.name,
      href: `/${parent.handle}`
    })),
    { label: category.name, isCurrentPage: true },
  ]

  return (
    <>
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
        <div className="mb-3">
          <Breadcrumb items={breadcrumbItems} showEllipsis={true} ellipsisPosition={1} />
          <PageTitle title={category.name} count={productCount}/>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8" data-testid="category-container">
          <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-6">
              <RefinementList />
            </div>
          </aside>
          <div className="flex-1">
            {category.category_children && (
              <div>
                <div className="flex flex-wrap gap-2 sm:gap-3 text-sm">
                  {category.category_children?.map((c) => (
                    <LocalizedClientLink
                      key={c.id}
                      href={`/${c.handle}`}
                      className="inline-block px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  ))}
                </div>
              </div>
            )}
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={category.products?.length ?? 8}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}