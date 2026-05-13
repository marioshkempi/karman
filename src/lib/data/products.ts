"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { COUNTRY_COOKIE, StoreProductReview } from "@constants/global"
import { getSiteSetting } from "@lib/data/site-settings"
import { cache } from "react"
import { client } from "@services/typesense/typesenseClient"
import { cookies } from "next/headers"

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

export const getProductByHandle = async (
  handle: string
): Promise<{
  id: string
  handle: string
  title: string
  subtitle?: string
  thumbnail?: string
  created_at: string
} | null> => {
  const collectionName =
    process.env.NEXT_PUBLIC_TYPESENSE_PRODUCTS_COLLECTION || "products"
  console.log(handle)
  try {
    const result = await client
      .collections(collectionName)
      .documents()
      .search({
        q: "*",
        filter_by: `handle:=${handle}`,
        limit: 1,
        include_fields: "id_product,handle,title,subtitle,thumbnail,created_at",
      })

    if (!result.hits?.length) return null

    const doc = result.hits[0].document as any

    return {
      id: doc.id_product,
      handle: doc.handle,
      title: doc.title,
      subtitle: doc.subtitle || undefined,
      thumbnail: doc.thumbnail || undefined,
      created_at: new Date(doc.created_at * 1000).toISOString(),
    }
  } catch (error) {
    console.error(`[getProductByHandle] Typesense failed for: ${handle}`, error)
    return null
  }
}

export const getProductByHandleCached = cache(getProductByHandle)

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
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  region = await getRegion()

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
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+brand.*,+global_feature_values.*, global_feature_values.feature.* ,*variants.images, categories.*,categories.parent_category.*,categories.parent_category.parent_category.*, external_id, variants.metadata, product_attachments.*",
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

export const getProductById = async ({ id }: { id: string }) => {
  const region = await getRegion()

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
  const cookieStore = await cookies()
  const countryCode: any = cookieStore.get(COUNTRY_COOKIE)?.value?.toLowerCase()
  try {
    const { product } = await sdk.client.fetch<{
      product: HttpTypes.StoreProduct & {
        bundle?: Omit<BundleProduct, "items">
      }
    }>(`/store/products/${id}`, {
      method: "GET",
      query: {
        country_code: countryCode,
        region_id: region?.id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,options.values.color_swatch.*, +metadata,+tags,+brand.*,+global_feature_values.*, global_feature_values.feature.* ,*variants.images, categories.*,categories.parent_category.*,categories.parent_category.parent_category.*, external_id, variants.metadata, product_attachments.*",
      },
      headers,
      next,
      cache: "force-cache",
    })

    return product
  } catch (error) {
    console.error(`[getProductById] Failed for id: ${id}`, error)
    return null
  }
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

export type AttachmentPosition =
  | "product_tab"
  | "before_add_to_cart"
  | "after_add_to_cart"

export interface ErpFile {
  id: number
  name: string
  originalFilename: string
  customFilename: string
  extension: string
  url: string
  description: string
  category_id: number
  category_name: string
  docSize: number
  uploadDate: string
  hoverImage: boolean
  defaultImage: boolean
  fileUrl: any
}

export interface ResolvedAttachmentGroup {
  id: string
  attachment_id: number
  title: string | null
  position: AttachmentPosition
  sort_order: number
  files: ErpFile[]
}

export async function getResolvedAttachments(
  productId: string
): Promise<ResolvedAttachmentGroup[]> {
  try {
    const data = await sdk.client.fetch<{
      erp_attachment_configs: ResolvedAttachmentGroup[]
    }>(`/store/products/${productId}/erp-attachments`, {
      method: "GET",
      next: { revalidate: 60 },
    })

    return (data.erp_attachment_configs || []).filter((g) => g.files.length > 0)
  } catch (error) {
    console.error("[getResolvedAttachments] Error:", error)
    return []
  }
}

export async function getProductPrices(
  id_product: string,
  quantity?: number,
  customerGroup?: any
) {
  try {
    if (!id_product) return null

    const headers = {
      ...(await getAuthHeaders()),
    }

    const apiUrl = "/store/products/get-product-discount"

    return await sdk.client.fetch(apiUrl, {
      method: "POST",
      headers,
      body: {
        id_product: id_product,
        ...(quantity != null && { quantity }),
        ...(customerGroup != null && { customerGroup }),
      },
    })
  } catch (error) {
    console.error("Error fetching product prices:", error)
    return null
  }
}

export async function getProductQuantityDiscounts(productExternalId: string) {
  try {
    if (!productExternalId) return null

    const headers = {
      ...(await getAuthHeaders()),
    }

    return await sdk.client.fetch(
      "/store/products/get-product-discount/get-product-quantity-discounts",
      {
        method: "POST",
        headers,
        body: {
          id_product: productExternalId,
        },
      }
    )
  } catch (error) {
    console.error("Error fetching quantity discounts:", error)
    return null
  }
}

export async function getProductDiscountsBatch(
  products: { id_product: string; product_key: string }[],
  quantity: number = 1
) {
  try {
    // console.log("products discounts", products)
    if (!products || products.length === 0) return null

    const headers = {
      ...(await getAuthHeaders()),
    }

    const payload = products.map((p) => ({
      ...p,
      quantity,
    }))

    return await sdk.client.fetch(
      "/store/products/get-product-discount/batch",
      {
        method: "POST",
        headers,
        body: {
          products: payload,
          quantity,
        },
      }
    )
  } catch (error) {
    console.error("Error fetching batch product discounts:", error)
    return null
  }
}
