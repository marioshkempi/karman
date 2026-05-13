"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface StoreFooterLink {
  id: string
  label: string
  url: string | null
  order: number
}

export interface StoreFooterSection {
  id: string
  title: string
  url: string | null
  link_type: string | null
  link_value: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  links: StoreFooterLink[]
}

export const listFooterSections = async (): Promise<{
  sections: StoreFooterSection[]
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("footer_sections")),
  }

  try {
    const { sections } = await sdk.client.fetch<{
      sections: StoreFooterSection[]
    }>(`/store/footer-links`, {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })

    return {
      sections,
    }
  } catch (error) {
    return {
      sections: [],
    }
  }
}