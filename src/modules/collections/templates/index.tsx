import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import BannerSection from "@modules/common/components/banner-section"
import { StoreBanner } from "@lib/data/banner"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  topBanners,
  sidebarBanners,
  // countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  topBanners?: StoreBanner[]
  sidebarBanners?: StoreBanner[]
  // countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      {/*<RefinementList sortBy={sort} />*/}
      {sidebarBanners && sidebarBanners.length > 0 && (
        <div className="w-full small:w-1/4 small:pr-4 mb-6 small:mb-0">
          <BannerSection banners={sidebarBanners} />
        </div>
      )}
      <div className="w-full">
        {topBanners && topBanners.length > 0 && (
          <div className="mb-6">
            <BannerSection banners={topBanners} />
          </div>
        )}
        <div className="mb-8 text-2xl-semi">
          <h1>{collection.title}</h1>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          {/*<PaginatedProducts*/}
          {/*  sortBy={sort}*/}
          {/*  page={pageNumber}*/}
          {/*  collectionId={collection.id}*/}
          {/*  // countryCode={countryCode}*/}
          {/*/>*/}
        </Suspense>
      </div>
    </div>
  )
}
