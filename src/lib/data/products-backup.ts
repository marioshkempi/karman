"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { StoreProductReview } from "../../types/global"
import { getSiteSetting } from "@lib/data/site-settings"

export type BundleProduct = {
  id: string
  title: string
  product: {
    id: string
    thumbnail: string
    title: string
    handle: string
  }
  items: {
    id: string
    title: string
    product: HttpTypes.StoreProduct
  }[]
}
//
export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: {
    products: (HttpTypes.StoreProduct & {
      bundle?: Omit<BundleProduct, "items">
    })[]
    count: number
  }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {

  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{
      products: (HttpTypes.StoreProduct & {
        bundle?: Omit<BundleProduct, "items">
      })[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        limit,
        offset,
        region_id: region?.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+brand.*,+global_feature_values.*, global_feature_values.feature.* , categories.*,categories.parent_category.*,categories.parent_category.parent_category.*, external_id, variants.metadata",
        ...queryParams,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}

function getDateDaysAgo(daysAgo: number): string {
  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - daysAgo)

  // Format as YYYY-MM-DD
  const year = pastDate.getFullYear()
  const month = String(pastDate.getMonth() + 1).padStart(2, "0") // months are 0-based
  const day = String(pastDate.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const getNewProducts = async ({
  queryParams = {},
  countryCode,
  page = 0,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams.limit || 12

  const updatedQueryParams = { ...queryParams }
  // const newProdsThreshold =  process.env.NEW_PRODS_THRESHOLD || 30
  const newProdsThreshold =
    (await getSiteSetting("new_product_threshold")) ?? 30
  //console.log(newProdsThreshold)
  // @ts-ignore
  updatedQueryParams["created_at[$gte]"] = getDateDaysAgo(newProdsThreshold)

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: page,
    queryParams: {
      ...updatedQueryParams,
      limit,
    },
    countryCode,
  })

  const nextPage = products.length < count ? page + 1 : null

  return {
    response: {
      products,
      count,
    },
    nextPage,
    queryParams: updatedQueryParams,
  }
}

export const getProductCount = async ({
  categoryId,
  countryCode,
  regionId,
}: {
  categoryId: string
  countryCode?: string
  regionId?: string
}): Promise<number> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return 0
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  try {
    const { count } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
      count: number
    }>(`/store/products`, {
      method: "GET",
      query: {
        category_id: [categoryId],
        region_id: region.id,
        limit: 1,
      },
      headers,
      next,
      cache: "force-cache",
    })

    return count
  } catch (error) {
    console.error("Error fetching product count:", error)
    return 0
  }
}

// export type BundleProduct = {
//   id: string
//   title: string
//   product: {
//     id: string
//     thumbnail: string
//     title: string
//     handle: string
//   }
//   items: {
//     id: string
//     title: string
//     product: HttpTypes.StoreProduct
//   }[]
// }

export const getBundleProduct = async (
  id: string,
  {
    currency_code,
    region_id,
  }: {
    currency_code?: string
    region_id?: string
  }
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client.fetch<{
    bundle_product: BundleProduct
  }>(`/store/bundle-products/${id}`, {
    method: "GET",
    headers,
    query: {
      currency_code,
      region_id,
    },
  })
}

export const getProductReviews = async ({
  productId,
  limit = 10,
  offset = 0,
}: {
  productId: string
  limit?: number
  offset?: number
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions(`product-reviews-${productId}`)),
  }
  console.log(productId)
  return sdk.client.fetch<{
    reviews: StoreProductReview[]
    average_rating: number
    limit: number
    offset: number
    count: number
  }>(`/store/products/${productId}/reviews`, {
    headers,
    query: {
      limit,
      offset,
      order: "-created_at",
    },
    next,
    cache: "force-cache",
  })
}

export const addProductReview = async (input: {
  title?: string
  content: string
  first_name: string
  last_name: string
  rating: number
  product_id: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client.fetch(`/store/reviews`, {
    method: "POST",
    headers,
    body: input,
    next: {
      ...(await getCacheOptions(`product-reviews-${input.product_id}`)),
    },
    cache: "no-store",
  })
}

export const getProductsOnSale = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12
  // Fetch all products (or a large batch) to filter for sale products
  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })
  // Filter products that have at least one variant with sale price
  const productsOnSale = products.filter((product) => {
    return product.variants?.some((variant) => {
      return (
        variant.calculated_price?.calculated_price?.price_list_type === "sale"
      )
    })
  })
  const sortedProducts = sortProducts(productsOnSale, sortBy)
  const pageParam = (page - 1) * limit
  const filteredCount = productsOnSale.length
  const totalPages = Math.ceil(filteredCount / limit)
  const nextPage = page < totalPages ? page + 1 : null
  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)
  return {
    response: {
      products: paginatedProducts,
      count: filteredCount,
    },
    nextPage,
    queryParams,
  }
}
