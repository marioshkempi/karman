import { Suspense } from "react"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import Breadcrumb from "@modules/common/components/breadcrumb"
import {
  searchPageGetProducts,
  storeGetAllProducts,
} from "@services/typesense/typesenseService"
import Spinner from "@modules/common/components/loading-spinner/Spinner"
import { getProductsPerPage } from "@lib/data/site-settings"
import { mapFacets } from "@lib/util/mapFacets"
import { getTranslations } from "next-intl/server"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  s,
  searchParams = {},
}: {
  sortBy?: SortOptions
  page?: string
  countryCode?: string
  s?: string
  searchParams?: Record<string, string | string[]>
}) => {
  const t = await getTranslations()
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const productsPerPage = await getProductsPerPage()

  const filters: Record<string, string[]> = {}
  Object.keys(searchParams).forEach((key) => {
    const value = searchParams[key]
    if (value !== undefined && value !== null) {
      filters[key] = Array.isArray(value) ? value : [String(value)]
    }
  })

  let typesenseProducts: any = {}
  let facetsToRender: any[] = []
  let lastLabel = t("store.search")
  if (s) {
    const res = await searchPageGetProducts(
      s,
      pageNumber,
      productsPerPage,
      sort,
      filters,
      searchParams.min_price ? Number(searchParams.min_price[0]) : 0,
      searchParams.max_price ? Number(searchParams.max_price[0]) : 130
    )

    typesenseProducts = {
      products: res.products || [],
      count: res.count || 0,
    }

    facetsToRender = mapFacets(res.facets || [])
  } else {
    const res = await storeGetAllProducts(
      pageNumber,
      productsPerPage,
      sort,
      filters,
      searchParams.min_price ? Number(searchParams.min_price[0]) : 0,
      searchParams.max_price ? Number(searchParams.max_price[0]) : 130
    )

    typesenseProducts = {
      products: res.products || [],
      count: res.count || 0,
    }

    facetsToRender = mapFacets(res.facets || [])
    lastLabel = t("store.store")
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
        <div className="mb-3">
          <Breadcrumb
            showEllipsis={true}
            ellipsisPosition={1}
            lastLabel={lastLabel}
          />
          <h2 className="text-xl lg:text-3xl font-semibold text-primary2 mt-4">
            {s
              ? t("store.searchResults", { query: s, count: typesenseProducts.count })
              : t("store.allProducts", { count: typesenseProducts.count })}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <RefinementList facets={facetsToRender} />

          <div className="flex-1 max-w-full lg:w-[70%]">
            <Suspense fallback={<Spinner />}>
              <PaginatedProducts
                limit={productsPerPage}
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                s={s}
                typeSenseProducts={typesenseProducts}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
