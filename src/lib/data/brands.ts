"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface StoreBrand {
  id: string
  name: string
  handle: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export const listBrands = async ({
  pageParam = 1,
  queryParams,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & {
    q?: string
    id?: string | string[]
    handle?: string | string[]
  }
} = {}): Promise<{
  response: {
    brands: StoreBrand[]
    count: number
    limit: number
    offset: number
  }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams
}> => {
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("brands")),
  }

  try {
    const {
      brands,
      count,
      limit: apiLimit,
      offset: apiOffset,
    } = await sdk.client.fetch<{
      brands: StoreBrand[]
      count: number
      limit: number
      offset: number
    }>(`/store/brands`, {
      method: "GET",
      query: {
        limit,
        offset,
        ...queryParams,
      },
      headers,
      next,
      cache: "force-cache",
    })

    // Determine next page availability
    const nextPage = count > offset + limit ? pageParam + 1 : null

    return {
      response: {
        brands,
        count,
        limit: apiLimit || limit,
        offset: apiOffset || offset,
      },
      nextPage,
      queryParams,
    }
  } catch (error) {
    console.error("Error fetching brands:", error)
    return {
      response: { brands: [], count: 0, limit, offset },
      nextPage: null,
    }
  }
}

export const retrieveBrandByHandle = async (
  handle: string
): Promise<StoreBrand | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("brands")),
  }

  try {
    const { brands } = await sdk.client.fetch<{
      brands: StoreBrand[]
      count: number
    }>(`/store/brands/${handle}`, {
      method: "GET",
      query: {
        limit: 1,
      },
      headers,
      next,
      cache: "force-cache",
    })
    return brands[0] || null
  } catch (error) {
    console.error(`Error fetching brand with handle ${handle}:`, error)
    return null
  }
}

export const getBrandCount = async (): Promise<number> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("brands")),
  }

  try {
    const { count } = await sdk.client.fetch<{
      brands: StoreBrand[]
      count: number
    }>(`/store/brands`, {
      method: "GET",
      query: {
        limit: 1,
      },
      headers,
      next,
      cache: "force-cache",
    })
    //console.log(count)
    return count
  } catch (error) {
    console.error("Error fetching brand count:", error)
    return 0
  }
}
