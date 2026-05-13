import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import Breadcrumb from "@modules/common/components/breadcrumb"
import PaginatedBrands from "../components/paginated-brands"
import PageTitle from "@modules/common/components/PageTitle"
type BrandsData = {
  brands: any[]
  pagination: {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

const BrandTemplate = ({
  sortBy,
  page,
  countryCode,
  brandsData,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  brandsData: BrandsData
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
        <div className="mb-6">
          <Breadcrumb
            showEllipsis={false}
            ellipsisPosition={1}
            lastLabel={"Brands"}
          />
          <PageTitle
            title={"Brands"}
            count={brandsData.pagination.totalItems}
            countlabel="Brand"
            isSearch={true}
          />
        </div>
        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-8"
          data-testid="category-container"
        >
          <div className="flex-1">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedBrands page={pageNumber} brandsData={brandsData} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandTemplate
