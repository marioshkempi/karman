"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface StoreBanner {
  id: string
  title: string
  description: string | null
  image_url: string
  mobile_image_url: string | null
  cta_text: string | null
  cta_url: string | null
  hook: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  query_parameters?: Array<{
    id: string
    param_key: string
    param_value: string
  }>
}

export const listBanners = async ({
  queryParams,
}: {
  queryParams?: Record<string, string>
} = {}): Promise<{
  banners: StoreBanner[]
  count: number
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("banners")),
  }

  try {
    const { banners, count } = await sdk.client.fetch<{
      banners: StoreBanner[]
      count: number
    }>(`/store/banners`, {
      method: "GET",
      query: queryParams,
      headers,
      next,
      cache: "force-cache",
    })

    return {
      banners,
      count,
    }
  } catch (error) {
    return {
      banners: [],
      count: 0,
    }
  }
}

export const getBannersByHook = async (
  hook: string
): Promise<{
  banners: StoreBanner[]
  count: number
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions(`banners-${hook}`)),
  }

  try {
    const { banners, count } = await sdk.client.fetch<{
      banners: StoreBanner[]
      count: number
    }>(`/store/banners`, {
      method: "GET",
      query: { hook },
      headers,
      next,
      cache: "force-cache",
    })

    return {
      banners,
      count,
    }
  } catch (error) {
    return {
      banners: [],
      count: 0,
    }
  }
}