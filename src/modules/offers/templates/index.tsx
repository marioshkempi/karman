import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import Breadcrumb from "@modules/common/components/breadcrumb"
import PageTitle from "@modules/common/components/PageTitle"
import PaginatedOffers from "../components/paginated-offers"

export default function OffersTemplate({
  sortBy,
  page,
  countryCode,
  productCount,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  productCount?: number
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
        <div className="mb-3">
          <Breadcrumb showEllipsis={true} ellipsisPosition={1} />
          <PageTitle title="Offers" count={productCount} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-6">
              <RefinementList />
            </div>
          </aside>

          <div className="flex-1">
            <Suspense
              key={`offers-${pageNumber}-${sort}`}
              fallback={<SkeletonProductGrid numberOfProducts={12} />}
            >
              <PaginatedOffers
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

