import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import Breadcrumb from "@modules/common/components/breadcrumb"
import PageTitle from "@modules/common/components/PageTitle"
import { Wishlist } from "@lib/data/wishlist"
import PaginatedWishlistProducts from "../paginated-wishlist"
import Spinner from "@modules/common/components/loading-spinner/Spinner"

export default function WishlistTemplate({
  wishlist,
  sortBy,
  page,
  countryCode,
}: {
  wishlist: Wishlist
  sortBy?: SortOptions
  page?: string
  countryCode?: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden small:block">
          <div className="mb-2">
            <h1 className="text-xl-semi text-secondary font-extrabold">
              Wishlist
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1">
            <Suspense fallback={<Spinner/>}>
              <PaginatedWishlistProducts
                wishlist={wishlist}
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
