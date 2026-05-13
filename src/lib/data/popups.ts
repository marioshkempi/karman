"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface StorePopup {
  id: string
  title: string | null
  text: string | null
  html_content: string | null
  image_url: string | null
  link: string | null
  cta_button_text: string | null
  cta_button_link: string | null
  is_active: boolean
  priority: number
  display_rules: any | null
  frequency_type: "once_per_session" | "daily" | "always" | "once_ever"
  cookie_name: string | null
  delay_seconds: number
  show_on_scroll_percent: number | null
  show_on_exit_intent: boolean
  target_pages: string[] | null
  target_categories: string[] | null
  target_custom_paths: string[] | null
  show_on_desktop: boolean
  show_on_mobile: boolean
  background_color: string | null
  text_color: string | null
  overlay_color: string | null
  overlay_opacity: number
  position: "center" | "top" | "bottom" | "left" | "right"
  cta_button_position: "bottom_center" | "bottom_left" | "bottom_right"
  width: string | null
  max_width: string | null
  created_at: string
  updated_at: string
}

export interface ListPopupsParams {
  page_type?: "homepage" | "checkout" | "category" | "product" | "custom"
  category_id?: string
  path?: string
  is_mobile?: boolean
}

export const listPopups = async ({
                                   page_type,
                                   category_id,
                                   path,
                                   is_mobile,
                                 }: ListPopupsParams = {}): Promise<{
  popups: StorePopup[]
  count: number
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("popups")),
  }

  const queryParams: Record<string, string> = {}

  if (page_type) {
    queryParams.page_type = page_type
  }

  if (category_id) {
    queryParams.category_id = category_id
  }

  if (path) {
    queryParams.path = path
  }

  if (is_mobile !== undefined) {
    queryParams.is_mobile = is_mobile.toString()
  }

  try {
    const { popups, count } = await sdk.client.fetch<{
      popups: StorePopup[]
      count: number
    }>(`/store/popups`, {
      method: "GET",
      query: queryParams,
      headers,
      next,
      cache: "force-cache",
    })

    return {
      popups,
      count,
    }
  } catch (error) {
    return {
      popups: [],
      count: 0,
    }
  }
}


export async function fetchPopups(params: ListPopupsParams) {
  const queryParams = new URLSearchParams()
  if (params.page_type) queryParams.append("page_type", params.page_type)
  if (params.category_id) queryParams.append("category_id", params.category_id)
  if (params.path) queryParams.append("path", params.path)
  if (params.is_mobile !== undefined) {
    queryParams.append("is_mobile", params.is_mobile.toString())
  }

  try {
    const response = await sdk.client.fetch(
      `/store/popups?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeaders()),
        },
        // This is a GET so Next.js can actually cache it
        cache: "force-cache",
        next: {
          ...(await getCacheOptions("popups")),
          revalidate: 300, // 5 min, adjust as needed
        },
      },
    )

    return {
      popups: (response as any).popups || [],
      count: (response as any).count || 0,
    }
  } catch (error) {
    console.error("Error fetching popups:", error)
    return { popups: [], count: 0 }
  }
}