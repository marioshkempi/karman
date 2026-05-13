import { notFound } from "next/navigation"
import { Suspense } from "react"

import Breadcrumb from "@modules/common/components/breadcrumb"
import PageTitle from "@modules/common/components/PageTitle"
import RefinementList from "@modules/store/components/refinement-list"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import Spinner from "@modules/common/components/loading-spinner/Spinner"
import { mapFacets } from "@lib/util/mapFacets"

export default function BrandViewTemplate({
  limit,
  brand,
  sortBy,
  page,
  countryCode,
  brandProducts,
}: {
  limit: number
  brand: { id: string; name: string }
  sortBy?: SortOptions
  page?: number | string
  countryCode: string
  brandProducts: any
}) {
  const pageNumber = page ? parseInt(String(page)) : 1
  const sort = sortBy || "created_at"

  if (!brand) notFound()

  // Ensure product structure matches category template
  // const typesenseProducts = {
  //   products: brandProducts.products || [],
  //   count: brandProducts.count || 0,
  // }

  const facetsToRender: any = mapFacets(brandProducts.facets || [])

  return (
    <div className="bg-gray-50 min-h-screen" key={brand.id}>
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
        <div className="mb-3">
          <Breadcrumb
            showEllipsis={false}
            ellipsisPosition={1}
            tree={[{ label: "Brands", href: "/brands" }]}
            lastLabel={brand.name}
          />
          <PageTitle title={brand.name} count={brandProducts?.count} />
        </div>

        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-8"
          data-testid="brand-container"
        >
          <RefinementList facets={facetsToRender} />

          <div className="flex-1 max-w-full lg:w-[50%]">
            <Suspense
              key={`${brand.id}-${pageNumber}-${sort}`}
              fallback={<Spinner />}
            >
              <PaginatedProducts
                limit={limit}
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                typeSenseProducts={brandProducts}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
