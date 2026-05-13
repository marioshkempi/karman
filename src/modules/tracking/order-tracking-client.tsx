"use client"

import { useEffect, useRef } from "react"

import { TrackingSettings } from "@constants/tracking"
import { SkroutzOrderTracking } from "@modules/tracking/skroutz-analytics/skroutz-order-tracking"
import { useTracking } from "@lib/hooks/use-tracking"

type OrderItem = {
  id: string
  variant_id?: string
  title: string
  unit_price: number
  quantity: number
  metadata?: Record<string, any>
}

type OrderData = {
  id: string
  total: number
  subtotal: number
  shipping_total: number
  tax_total: number
  currency_code: string
  discount_code?: string
  items: OrderItem[]
}

type SkroutzConfig = {
  enabled: boolean
  shop_account_id: string
  merchant_id?: string
  tracking_url?: string
  analytics_url?: string
} | null

export function OrderTrackingClient({
  order,
  trackingSettings,
  skroutzConfig,
}: {
  order: OrderData
  trackingSettings: TrackingSettings
  skroutzConfig: SkroutzConfig
}) {
  const tracked = useRef(false)
  const { trackPurchase } = useTracking(trackingSettings)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    trackPurchase({
      transaction_id: order.id,
      currency: order.currency_code,
      value: order.total,
      tax: order.tax_total,
      shipping: order.shipping_total,
      coupon: order.discount_code,
      items: order.items.map((item) => ({
        item_id: item.variant_id || item.id,
        item_name: item.title,
        price: item.unit_price,
        quantity: item.quantity,
      })),
    })
  }, [order.id])

  return (
    <SkroutzOrderTracking
      order={{
        id: order.id,
        total: order.total,
        subtotal: order.subtotal,
        shipping_total: order.shipping_total,
        tax_total: order.tax_total,
        items: order.items.map((item) => ({
          id: item.id,
          variant_id: item.variant_id,
          title: item.title,
          unit_price: item.unit_price,
          quantity: item.quantity,
          metadata: item.metadata,
        })),
      }}
    />
  )
}
