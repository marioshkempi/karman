
export type TrackingSettings = {
  fb_pixel_id: string | null
  fb_pixel_enabled: boolean
  gtm_id: string | null
  gtm_enabled: boolean
  ga4_measurement_id: string | null
  ga4_enabled: boolean
}

export type EcommerceItem = {
  item_id: string
  item_name: string
  price?: number
  quantity?: number
  currency?: string
  item_category?: string
  item_brand?: string
  item_variant?: string
}

export type EcommerceEventData = {
  currency?: string
  value?: number
  items?: EcommerceItem[]
  transaction_id?: string
  shipping?: number
  tax?: number
  coupon?: string
}
