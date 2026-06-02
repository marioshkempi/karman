import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import Breadcrumb from "@modules/common/components/breadcrumb"
import CategoryChildrenLinks from "../components/category-children-links"
import Spinner from "@modules/common/components/loading-spinner/Spinner"
import { buildCategoryTree } from "@lib/util/build-category-tree"
import { notFound } from "next/navigation"
import { mapFacets } from "@lib/util/mapFacets"
import Image from "next/image"

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

  // Reassurance items for category page
  const reassuranceItems = [
    {
      icon: "/images/icons/trust-badge-1.png",
      title: "Εγγύηση Συμβατότητας",
      description: "Βρίσκουμε τα σωστά ανταλλακτικά για το μοντέλο σας."
    },
    {
      icon: "/images/icons/trust-badge-2.png", 
      title: "Ασφαλείς πληρωμές",
      description: "Κρυπτογραφημένες συναλλαγές με πιστοποίηση SSL."
    },
    {
      icon: "/images/icons/trust-badge-3.png",
      title: "Premium Quality",
      description: "Εξαιρετικά ανταλλακτικά για μέγιστη απόδοση."
    }
  ]

  return (
    <div className="bg-white min-h-screen" key={category.id}>
      {/* Hero Banner */}
      <div 
        className="w-full py-6 lg:py-10"
        style={{ background: "linear-gradient(90deg, #283B82 0%, #007BFF 50%, #283B82 100%)" }}
      >
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-2">
            <Breadcrumb
              showEllipsis={false}
              ellipsisPosition={1}
              categories={categoryTree}
              lightMode={true}
            />
          </div>
          {/* Category Title */}
          <h1 className="text-white text-2xl lg:text-4xl font-bold">
            {category.name}
          </h1>
        </div>
      </div>

      {/* Reassurance Row */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          {/* Mobile: horizontal scroll */}
          <div className="flex lg:hidden overflow-x-auto gap-4 pb-2 -mx-4 px-4 scrollbar-hide">
            {reassuranceItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 min-w-[200px] flex-shrink-0">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Image src={item.icon} alt={item.title} width={40} height={40} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-[#007BFF] text-xs font-semibold whitespace-nowrap">{item.title}</h3>
                  <p className="text-gray-500 text-[10px] whitespace-nowrap">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: flex row */}
          <div className="hidden lg:flex lg:justify-between lg:items-center">
            {reassuranceItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <Image src={item.icon} alt={item.title} width={56} height={56} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-[#007BFF] text-sm font-semibold">{item.title}</h3>
                  <p className="text-gray-500 text-xs">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div
          className="flex flex-col lg:flex-row gap-6 lg:gap-8"
          data-testid="category-container"
        >
          <RefinementList
            facets={facetsToRender}
            count={categoryProducts?.count}
          />

          <div className="flex-1 max-w-full">
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
