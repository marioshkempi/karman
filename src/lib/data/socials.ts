"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface StoreSocial {
  id: string
  label: string
  link: string
  primary_icon: string
  secondary_icon: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export const listSocials = async (): Promise<{
  socials: StoreSocial[]
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("socials")),
  }

  try {
    const { socials } = await sdk.client.fetch<{
      socials: StoreSocial[]
    }>(`/store/socials`, {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })

    return {
      socials,
    }
  } catch (error) {
    return {
      socials: [],
    }
  }
}