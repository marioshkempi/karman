"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export interface StoreSlide {
  id: string
  title: string | null
  subtitle: string | null
  handle: string
  is_active: boolean
  description: string | null
  image_url: string
  mobile_image_url: string
  cta_text: string | null
  cta_url: string | null
  cta_style: "primary" | "secondary" | "tertiary" | "quaternary"
  text_alignment: "left" | "center" | "right"
  text_color: string
  order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface StoreSlider {
  id: string
  handle: string
  title: string
  is_active: boolean
  created_at: string
  updated_at: string
  slides: StoreSlide[]
}

export const getSlider = async (
  handle: string
): Promise<{
  slider: StoreSlider | null
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("sliders")),
  }

  try {
    const { slider } = await sdk.client.fetch<{
      slider: StoreSlider
    }>(`/store/sliders/${handle}`, {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })

    return {
      slider,
    }
  } catch (error) {
    return {
      slider: null,
    }
  }
}