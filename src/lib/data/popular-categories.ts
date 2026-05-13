"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "@lib/data/cookies"

export interface StorePopularCategoryItem {
  id: string
  title: string
  image_url: string | null
  link_type: "product" | "category" | "custom" | null
  link_value: string | null
  url: string | null
  order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface StorePopularCategorySection {
  id: string
  title: string
  cta_text: string
  order: number
  is_active: boolean
  items: StorePopularCategoryItem[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export const listPopularCategorySections = async (): Promise<{
  sections: StorePopularCategorySection[]
  count: number
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("popular_categories")),
  }

  try {
    const { sections, count } = await sdk.client.fetch<{
      sections: StorePopularCategorySection[]
      count: number
    }>(`/store/popular-categories`, {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })

    return {
      sections: sections || [],
      count: count || 0,
    }
  } catch (error) {
    return {
      sections: [],
      count: 0,
    }
  }
}

