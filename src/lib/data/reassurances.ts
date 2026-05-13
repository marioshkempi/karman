"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface StoreReassurance {
  id: string
  icon_url: string | null
  language: string
  title: string
  description: string | null
  redirect_type: string | null
  redirect_value: string | null
  is_active: boolean
  order: number
  created_at?: string
  updated_at?: string
}

export interface ListReassurancesParams {
  language?: string
  page_type?: "home" | "product" | "cart"
}

export const listReassurances = async ({
  language,
  page_type,
}: ListReassurancesParams = {}): Promise<{
  reassurances: StoreReassurance[]
  count: number
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("reassurances")),
  }

  const queryParams: Record<string, string> = {}

  if (language) {
    queryParams.language = language
  }

  //console.log("Fetching reassurances with params:", {
  //   language,
  //   page_type,
  //   queryParams,
  //   url: `/store/reassurances${Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : ''}`
  // })

  try {
    const { reassurances, count } = await sdk.client.fetch<{
      reassurances: StoreReassurance[]
      count: number
    }>(`/store/reassurances`, {
      method: "GET",
      query: queryParams,
      headers,
      next,
      cache: "force-cache",
    })

    //console.log("Reassurances fetched:", {
    //   total: reassurances.length,
    //   count,
    //   language,
    //   page_type,
    //   queryParams,
    //   reassurances: reassurances.map((r) => ({
    //     id: r.id,
    //     title: r.title,
    //     language: r.language,
    //     order: r.order,
    //     is_active: r.is_active,
    //   })),
    // })

    return {
      reassurances: reassurances,
      count: reassurances.length,
    }
  } catch (error) {
    console.error("Error fetching reassurances:", error)
    return {
      reassurances: [],
      count: 0,
    }
  }
}

