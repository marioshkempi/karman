"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { HttpTypes } from "@medusajs/types"

export interface FeaturedProductsResponse {
  products: HttpTypes.StoreProduct[]
  count: number
  total_count: number
  offset: number
  limit: number
}

export const getFeaturedProducts = async ({
  limit,
  offset = 0,
  countryCode,
  regionId,
}: {
  limit?: number
  offset?: number
  countryCode?: string
  regionId?: string
} = {}): Promise<FeaturedProductsResponse> => {
  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else if (regionId) {
    region = await retrieveRegion(regionId)
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("featured-products")),
  }

  const queryParams: Record<string, string> = {}
  
  if (limit) {
    queryParams.limit = limit.toString()
  }
  
  if (offset) {
    queryParams.offset = offset.toString()
  }
  
  if (region?.id) {
    queryParams.region_id = region.id
  }

  if (region?.currency_code) {
    queryParams.currency_code = region.currency_code
  }

  try {
    const response = await sdk.client.fetch<FeaturedProductsResponse>(
      `/store/products/featured`,
      {
        method: "GET",
        query: queryParams,
        headers,
        next,
        cache: "force-cache",
      }
    )

    return {
      products: response.products || [],
      count: response.count || 0,
      total_count: response.total_count || 0,
      offset: response.offset || 0,
      limit: response.limit || 0,
    }
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return {
      products: [],
      count: 0,
      total_count: 0,
      offset: 0,
      limit: 0,
    }
  }
}

export const getTopFeaturedProducts = async ({
  count = 10,
  countryCode,
  regionId,
}: {
  count?: number
  countryCode?: string
  regionId?: string
}): Promise<HttpTypes.StoreProduct[]> => {
  const { products } = await getFeaturedProducts({ 
    limit: count,
    countryCode,
    regionId,
  })
  return products.slice(0, count)
}

export const getAllFeaturedProducts = async ({
  countryCode,
  regionId,
}: {
  countryCode?: string
  regionId?: string
} = {}): Promise<HttpTypes.StoreProduct[]> => {
  const { products } = await getFeaturedProducts({ 
    countryCode,
    regionId,
  })
  return products
}