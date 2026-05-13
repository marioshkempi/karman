import CategoryView from "@modules/categories/CategoryView"

type Props = {
  params: { handle: string[] }
  searchParams: {
    sortBy?: string
    page?: number
    brand?: string
    features?: string | string[]
    min_price?: string | string[]
    max_price?: string | string[]
    option?: string | string[]
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  return (
    <CategoryView
      handle={params.handle}
      searchParams={searchParams}
    />
  )
}

// import { Metadata } from "next"
// import { notFound } from "next/navigation"
//
// import { getCategoryByHandle } from "@lib/data/categories"
// import CategoryTemplate from "@modules/categories/templates"
// import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
// import { categoryGetProducts } from "@services/typesense/typesenseService"
// import { getProductsPerPage } from "@lib/data/site-settings"
//
// type Props = {
//   params: Promise<{ handle: string[] }>
//   searchParams: Promise<{
//     sortBy?: SortOptions
//     page?: number
//     brand?: string
//     features?: string | string[]
//     min_price?: string | string[]
//     max_price?: string | string[]
//     option?: string | string[]
//   }>
// }
//
// export default async function CategoryPage(props: Props) {
//   const { handle } = await props.params
//   // console.log(handle)
//   const searchParamsRaw = await props.searchParams
//
//   const productCategory = await getCategoryByHandle(handle)
//   console.log(productCategory)
//   if (!productCategory) notFound()
//
//   const page = searchParamsRaw.page ? parseInt(searchParamsRaw.page as any) : 1
//
//   const sortBy = searchParamsRaw.sortBy || "created_at"
//
//   const filters: Record<string, string | string[]> = {}
//   Object.keys(searchParamsRaw as any).forEach((key) => {
//     const value = (searchParamsRaw as any)[key]
//     if (value !== undefined && value !== null) {
//       filters[key] = Array.isArray(value) ? value : [String(value)]
//     }
//   })
//
//   filters.category_ancestors = productCategory.id
//
//   const productsPerPage = await getProductsPerPage()
//
//   const categoryProducts = await categoryGetProducts(
//     productCategory.id,
//     page,
//     productsPerPage,
//     sortBy,
//     filters,
//     searchParamsRaw.min_price ? Number(searchParamsRaw.min_price) : 0,
//     searchParamsRaw.max_price ? Number(searchParamsRaw.max_price) : 0
//   )
//
//   return (
//     <CategoryTemplate
//       limit={productsPerPage}
//       category={productCategory}
//       sortBy={sortBy}
//       page={page}
//       categoryProducts={categoryProducts}
//     />
//   )
// }

// import { Metadata } from "next"
// import { notFound } from "next/navigation"
//
// import { getCategoryByHandle, listCategories } from "@lib/data/categories"
// import { listRegions } from "@lib/data/regions"
// import { StoreRegion } from "@medusajs/types"
// import CategoryTemplate from "@modules/categories/templates"
// import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
// import { categoryGetProducts } from "@services/typesense/typesenseService"
// import { getProductsPerPage } from "@lib/data/site-settings"
// import { getNestedCategoryIds } from "@lib/util/getNestedCategoriesIds"
//
// type Props = {
//   params: Promise<{ category: string[];  }>
//   searchParams: Promise<{
//     sortBy?: SortOptions
//     page?: number
//     brand?: string
//     features?: string | string[]
//     min_price?: string | string[]
//     max_price?: string | string[]
//     option?: string | string[]
//   }>
// }
//
// // export async function generateStaticParams() {
// //   const product_categories = await listCategories()
// //   if (!product_categories) return []
// //
// //   const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
// //     regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
// //   )
// //
// //   const categoryHandles = product_categories.map(
// //     (category: any) => category.handle
// //   )
// //
// //   return countryCodes
// //     ?.map(( | undefined) =>
// //       categoryHandles.map((handle: any) => ({
// //         countryCode,
// //         category: [handle],
// //       }))
// //     )
// //     .flat()
// // }
//
// export async function generateMetadata(props: Props): Promise<Metadata> {
//   const params = await props.params
//   try {
//     const productCategory = await getCategoryByHandle(params.category)
//     const title = productCategory.name + ""
//     const description = productCategory.description ?? `${title} category.`
//     return {
//       title,
//       description,
//       alternates: { canonical: `${params.category.join("/")}` },
//     }
//   } catch {
//     notFound()
//   }
// }
//
// export default async function CategoryPage(props: Props) {
//   const params = await props.params
//   const searchParamsRaw = await props.searchParams
//
//   const productCategory = await getCategoryByHandle(params.category)
//
//   if (!productCategory) notFound()
//
//   // const categoryChildrenIds = productCategory.category_children.map(
//   //   (child) => child.id
//   // )
//   // const categoryIdsToQuery = getNestedCategoryIds(productCategory)
//
//   const page = searchParamsRaw.page ? parseInt(searchParamsRaw.page as any) : 1
//   const sortBy = searchParamsRaw.sortBy || "created_at"
//
//   const filters: Record<string, string | string[]> = {}
//   Object.keys(searchParamsRaw as any).forEach((key: any) => {
//     // @ts-ignore
//     const value: any = searchParamsRaw[key]
//     if (value !== undefined && value !== null) {
//       filters[key] = Array.isArray(value) ? value : [String(value)]
//     }
//   })
//
//   filters.category_ancestors = productCategory.id
//   const productsPerPage = await getProductsPerPage()
//
//   const parsePriceParam = (v?: string | string[]) => {
//     if (!v) return undefined
//
//     const raw = Array.isArray(v) ? v[0] : v
//     const normalized = raw.replace(",", ".")
//     const n = Number(normalized)
//
//     return Number.isFinite(n) ? n : undefined
//   }
//
//   const categoryProducts = await categoryGetProducts(
//     productCategory.id,
//     page,
//     productsPerPage,
//     sortBy,
//     filters,
//     searchParamsRaw.min_price ? Number(searchParamsRaw.min_price) : 0,
//     searchParamsRaw.max_price ? Number(searchParamsRaw.max_price) : 0
//
//   )
//
//   return (
//     <CategoryTemplate
//       limit={productsPerPage}
//       category={productCategory}
//       sortBy={sortBy}
//       page={page}
//       countryCode={params.countryCode}
//       categoryProducts={categoryProducts}
//       // isLoading={false} // pass false initially (server-side data is loaded)
//     />
//   )
// }
