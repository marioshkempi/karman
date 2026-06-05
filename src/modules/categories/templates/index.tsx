import { Suspense } from "react"
import React from "react"

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
        className="w-full h-[117px] lg:h-[215px] relative"
        style={{ 
          background: "linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #1976d2 75%, #0d47a1 100%)"
        }}
      >
        {/* Decorative overlay for automotive feel */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url('/images/category-banner-overlay.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10">
          {/* Breadcrumb */}
          <div className="mb-1 lg:mb-2">
            <Breadcrumb
              showEllipsis={false}
              ellipsisPosition={1}
              categories={categoryTree}
              lightMode={true}
            />
          </div>
          {/* Category Title */}
          <h1 className="text-white text-xl lg:text-4xl font-bold">
            {category.name}
          </h1>
        </div>
      </div>

      {/* Reassurance Row */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          {/* Mobile: horizontal scroll */}
          <div className="flex lg:hidden overflow-x-auto gap-3 pb-1 -mx-4 px-4 scrollbar-hide">
            {reassuranceItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 min-w-[180px] flex-shrink-0">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <Image src={item.icon} alt={item.title} width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <h3 className="text-[#007BFF] text-[11px] font-semibold whitespace-nowrap">{item.title}</h3>
                  <p className="text-gray-500 text-[9px] whitespace-nowrap">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: flex row with dividers */}
          <div className="hidden lg:flex lg:justify-between lg:items-center">
            {reassuranceItems.map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <Image src={item.icon} alt={item.title} width={48} height={48} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="text-[#007BFF] text-sm font-semibold">{item.title}</h3>
                    <p className="text-gray-500 text-xs">{item.description}</p>
                  </div>
                </div>
                {index < reassuranceItems.length - 1 && (
                  <div className="h-10 w-px bg-gray-200" />
                )}
              </React.Fragment>
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
