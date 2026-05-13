"use client"

import { useEffect, useRef } from "react"

type SkroutzOrderItem = {
  order_id: string
  product_id: string
  name: string
  price: string
  quantity: string
}

type SkroutzOrder = {
  order_id: string
  revenue: string
  shipping: string
  tax: string
}

type OrderData = {
  id: string
  total: number
  subtotal: number
  shipping_total: number
  tax_total: number
  items: {
    id: string
    variant_id?: string
    title: string
    unit_price: number
    quantity: number
    metadata?: Record<string, any>
  }[]
}

export function SkroutzOrderTracking({ order }: { order: OrderData }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    if (typeof window === "undefined" || !window.skroutz_analytics) return

    tracked.current = true

    const revenue = order.total
    const shipping = order.shipping_total
    const tax = order.tax_total

    const orderPayload: SkroutzOrder = {
      order_id: order.id,
      revenue: revenue.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
    }

    window.skroutz_analytics(
      "ecommerce",
      "addOrder",
      JSON.stringify(orderPayload)
    )

    for (const item of order.items) {
      // Use skroutz_code from metadata if available, otherwise variant_id or item id
      const productId =
        item.metadata?.skroutz_code || item.variant_id || item.id

      const itemPayload: SkroutzOrderItem = {
        order_id: order.id,
        product_id: productId,
        name: item.title,
        price: item.unit_price.toFixed(2),
        quantity: item.quantity.toString(),
      }

      window.skroutz_analytics(
        "ecommerce",
        "addItem",
        JSON.stringify(itemPayload)
      )
    }
  }, [order])

  return null
}
