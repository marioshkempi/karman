"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { HttpTypes } from "@medusajs/types"

export interface BestSellingResponse {
  top_products: HttpTypes.StoreProduct[]
  total_count: number
}

export const getBestSellingProducts = async ({
  limit,
  countryCode,
  regionId,
}: {
  limit?: number
  countryCode?: string
  regionId?: string
} = {}): Promise<BestSellingResponse> => {
  // Get region using same logic as listProducts
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
    ...(await getCacheOptions("best-selling-products")),
  }

  const queryParams: Record<string, string> = {}
  
  if (limit) {
    queryParams.limit = limit.toString()
  }
  
  if (region?.id) {
    queryParams.region_id = region.id
  }

  try {
    const response = await sdk.client.fetch<BestSellingResponse>(
      `/store/analytics/best-selling`,
      {
        method: "GET",
        query: queryParams,
        headers,
        next,
        cache: "force-cache",
      }
    )

    return {
      top_products: response.top_products || [],
      total_count: response.total_count || 0,
    }
  } catch (error) {
    console.error("Error fetching best-selling products:", error)
    return {
      top_products: [],
      total_count: 0,
    }
  }
}

export const getTopBestSellers = async ({
  count = 10,
  countryCode,
  regionId,
}: {
  count?: number
  countryCode?: string
  regionId?: string
}): Promise<HttpTypes.StoreProduct[]> => {
  const { top_products } = await getBestSellingProducts({ 
    limit: count,
    countryCode,
    regionId,
  })
  return top_products.slice(0, count)
}