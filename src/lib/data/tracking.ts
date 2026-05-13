"use server"

import { sdk } from "@lib/config"

export type TrackingLabel = {
  tracking_number: string
  tracking_url: string | null
}

export type TrackingFulfillment = {
  fulfillment_id: string
  shipped_at: string | null
  labels: TrackingLabel[]
}

export type TrackingItem = {
  tracking_number: string
  tracking_url: string | null
  shipping_method: string | null
  shipped_at: string | null
  delivered_at: string | null
}

export type TrackingResponse = {
  order_id: string
  display_id: number | null
  tracking: TrackingItem[]
}

/**
 * Look up tracking by order number + email/phone
 */
export async function lookupByOrder(
  orderNumber: string,
  emailOrPhone: string
): Promise<TrackingResponse | null> {
  try {
    return await sdk.client.fetch<TrackingResponse>(
      `/store/order/tracking/lookup`,
      {
        method: "POST",
        body: {
          order_number: orderNumber,
          email_or_phone: emailOrPhone,
        },
      }
    )
  } catch {
    return null
  }
}

/**
 * Look up tracking by tracking number
 */
export async function lookupByTrackingNumber(
  trackingNumber: string
): Promise<TrackingResponse | null> {
  try {
    return await sdk.client.fetch<TrackingResponse>(
      `/store/order/tracking/lookup`,
      {
        method: "POST",
        body: {
          tracking_number: trackingNumber,
        },
      }
    )
  } catch {
    return null
  }
}
