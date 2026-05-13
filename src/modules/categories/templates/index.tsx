import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import Breadcrumb from "@modules/common/components/breadcrumb"
import PageTitle from "@modules/common/components/PageTitle"
import CategoryChildrenLinks from "../components/category-children-links"
import Spinner from "@modules/common/components/loading-spinner/Spinner"
import { buildCategoryTree } from "@lib/util/build-category-tree"
import { notFound } from "next/navigation"
import { mapFacets } from "@lib/util/mapFacets"

export default function CategoryTemplate({
  limit,
  category,
  sortBy,
  page,
  countryCode,
  productCount,
  categoryProducts,
}: // isLoading = false,
{
  limit: number
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: number
  countryCode?: string
  productCount?: number
  categoryProducts?: any
  // isLoading: boolean
}) {
  const pageNumber = page ? parseInt(page as any) : 1

  const sort = sortBy || "created_at"

  if (!category) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  let facetsToRender: any = []

  facetsToRender = mapFacets(categoryProducts.facets || [])

  const categoryTree = buildCategoryTree(category)

  return (
    <div className="bg-gray-50 min-h-screen" key={category.id}>
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
        <div className="mb-3">
          <Breadcrumb
            showEllipsis={false}
            ellipsisPosition={1}
            // lastLabel={category.name}
            categories={categoryTree}
          />
          <PageTitle
            title={category.name}
            count={categoryProducts?.count || productCount}
          />
        </div>

        {/*<CategoryChildrenLinks children={category.category_children || []} />*/}

        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-8"
          data-testid="category-container"
        >
          <RefinementList
            facets={facetsToRender}
            count={categoryProducts?.count}
          />

          <div className="flex-1 max-w-full lg:w-[50%]">
            <Suspense
              key={`${category.id}-${pageNumber}-${sort}-${categoryProducts}`}
              fallback={<Spinner />}
            >
              <PaginatedProducts
                limit={limit}
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
                typeSenseProducts={categoryProducts}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
