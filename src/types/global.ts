import { StorePrice, HttpTypes } from "@medusajs/types"
import { any } from "prop-types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

export type StoreProductReview = {
  id: string
  title: string
  rating: number
  content: string
  first_name: string
  last_name: string
  created_at?: string
  updated_at?: string
}

export type ProductAttachment = {
  id: string
  product_id: string
  name: string
  url: string
  metadata?: any
  created_at: string
  updated_at: string
}

export type MyStoreProduct = HttpTypes.StoreProduct & {
  brand?: {
    id: string
    name: string
    image_url?: string
    handle?: string
    description?: string
    products?: any
  }
  price?: StorePrice
  product_attachments?: ProductAttachment[]
}

export const COUNTRY_COOKIE =
  process.env.NEXT_PUBLIC_COUNTRY_CODE_COOKIE ?? "_medusa_country_code"
export const NEXT_LOCALE_COOKIE =
  process.env.NEXT_PUBLIC_NEXT_LOCALE_COOKIE ?? "NEXT_LOCALE"
export const MEDUSA_LOCALE_COOKIE =
  process.env.NEXT_PUBLIC_MEDUSA_LOCALE_COOKIE ?? "_medusa_locale"
export const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "el"
