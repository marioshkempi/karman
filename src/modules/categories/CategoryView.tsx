import { notFound } from "next/navigation"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { categoryGetProducts } from "@services/typesense/typesenseService"

type Props = {
  productCategory: any
  resolvedSearchParams: {
    sortBy?: SortOptions
    page?: number
    brand?: string
    features?: string | string[]
    min_price?: string | string[]
    max_price?: string | string[]
    option?: string | string[]
    [key: string]: any
  }
  productsPerPage: number
}

export default async function CategoryView({
  productCategory,
  resolvedSearchParams,
  productsPerPage,
}: Props) {
  if (!productCategory) notFound()
  console.log(productCategory)
  const start = performance.now()

  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1
  const sortBy: any = resolvedSearchParams.sortBy || "quantity_available"
  const childIds = (productCategory.category_children || []).map((child: any) => child.id)
  const allCategoryIds = [productCategory.id, ...childIds]
  const filters: Record<string, string | string[]> = {}

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      filters[key] = Array.isArray(value) ? value : [String(value)]
    }
  })

  filters.category_ancestors = productCategory.id
  filters.categories_ids = productCategory.id
  // console.log(productCategory.category_children)
  const categoryProducts = await categoryGetProducts(
    productCategory.id,
    page,
    productsPerPage,
    sortBy,
    filters,
    resolvedSearchParams.min_price ? Number(resolvedSearchParams.min_price) : 0,
    resolvedSearchParams.max_price ? Number(resolvedSearchParams.max_price) : 0
  )

  return (
    <CategoryTemplate
      limit={productsPerPage}
      category={productCategory}
      sortBy={sortBy}
      page={page}
      categoryProducts={categoryProducts}
    />
  )
}
