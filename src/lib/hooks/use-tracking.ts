"use client"

import { useCallback } from "react"
import { EcommerceEventData, TrackingSettings } from "@constants/tracking"

/**
 * Hook that fires e-commerce events to all enabled channels.
 *
 * Usage:
 *   const { trackAddToCart, trackPurchase } = useTracking(trackingSettings)
 */
export function useTracking(tracking: TrackingSettings) {
  const fbq = useCallback(
    (event: string, params?: Record<string, any>) => {
      if (!tracking.fb_pixel_enabled || !tracking.fb_pixel_id) return
      // @ts-ignore
      if (typeof window === "undefined" || !window.fbq) return
      if (params) {
        // @ts-ignore
        window.fbq("track", event, params)
      } else {
        // @ts-ignore
        window.fbq("track", event)
      }
    },
    [tracking.fb_pixel_enabled, tracking.fb_pixel_id]
  )

  const gtag = useCallback(
    (event: string, params?: Record<string, any>) => {
      if (!tracking.ga4_enabled || !tracking.ga4_measurement_id) return
      // @ts-ignore
      if (typeof window === "undefined" || !window.gtag) return
      // @ts-ignore
      window.gtag("event", event, params)
    },
    [tracking.ga4_enabled, tracking.ga4_measurement_id]
  )

  const pushDataLayer = useCallback(
    (data: Record<string, any>) => {
      if (!tracking.gtm_enabled || !tracking.gtm_id) return
      // @ts-ignore
      if (typeof window === "undefined" || !window.dataLayer) return
      // @ts-ignore
      window.dataLayer.push(data)
    },
    [tracking.gtm_enabled, tracking.gtm_id]
  )

  // ─── E-commerce Events ──────────────────────────────────────

  const trackViewItem = useCallback(
    (data: EcommerceEventData) => {
      const item = data.items?.[0]
      if (!item) return

      fbq("ViewContent", {
        content_ids: [item.item_id],
        content_name: item.item_name,
        content_type: "product",
        value: data.value,
        currency: data.currency,
      })

      gtag("view_item", {
        currency: data.currency,
        value: data.value,
        items: data.items,
      })

      pushDataLayer({
        event: "view_item",
        ecommerce: {
          currency: data.currency,
          value: data.value,
          items: data.items,
        },
      })
    },
    [fbq, gtag, pushDataLayer]
  )

  const trackAddToCart = useCallback(
    (data: EcommerceEventData) => {
      const item = data.items?.[0]

      fbq("AddToCart", {
        content_ids: data.items?.map((i) => i.item_id),
        content_name: item?.item_name,
        content_type: "product",
        value: data.value,
        currency: data.currency,
        num_items: data.items?.reduce(
          (sum: any, i: any) => sum + (i.quantity || 1),
          0
        ),
      })

      gtag("add_to_cart", {
        currency: data.currency,
        value: data.value,
        items: data.items,
      })

      pushDataLayer({
        event: "add_to_cart",
        ecommerce: {
          currency: data.currency,
          value: data.value,
          items: data.items,
        },
      })
    },
    [fbq, gtag, pushDataLayer]
  )

  const trackRemoveFromCart = useCallback(
    (data: EcommerceEventData) => {
      gtag("remove_from_cart", {
        currency: data.currency,
        value: data.value,
        items: data.items,
      })

      pushDataLayer({
        event: "remove_from_cart",
        ecommerce: {
          currency: data.currency,
          value: data.value,
          items: data.items,
        },
      })
    },
    [gtag, pushDataLayer]
  )

  const trackBeginCheckout = useCallback(
    (data: EcommerceEventData) => {
      fbq("InitiateCheckout", {
        content_ids: data.items?.map((i: any) => i.item_id),
        value: data.value,
        currency: data.currency,
        num_items: data.items?.reduce(
          (sum: any, i: any) => sum + (i.quantity || 1),
          0
        ),
      })

      gtag("begin_checkout", {
        currency: data.currency,
        value: data.value,
        coupon: data.coupon,
        items: data.items,
      })

      pushDataLayer({
        event: "begin_checkout",
        ecommerce: {
          currency: data.currency,
          value: data.value,
          coupon: data.coupon,
          items: data.items,
        },
      })
    },
    [fbq, gtag, pushDataLayer]
  )

  const trackAddPaymentInfo = useCallback(
    (data: EcommerceEventData & { payment_type?: string }) => {
      fbq("AddPaymentInfo", {
        value: data.value,
        currency: data.currency,
      })

      gtag("add_payment_info", {
        currency: data.currency,
        value: data.value,
        payment_type: data.payment_type,
        items: data.items,
      })

      pushDataLayer({
        event: "add_payment_info",
        ecommerce: {
          currency: data.currency,
          value: data.value,
          payment_type: data.payment_type,
          items: data.items,
        },
      })
    },
    [fbq, gtag, pushDataLayer]
  )

  const trackAddShippingInfo = useCallback(
    (data: EcommerceEventData & { shipping_tier?: string }) => {
      gtag("add_shipping_info", {
        currency: data.currency,
        value: data.value,
        shipping_tier: data.shipping_tier,
        items: data.items,
      })

      pushDataLayer({
        event: "add_shipping_info",
        ecommerce: {
          currency: data.currency,
          value: data.value,
          shipping_tier: data.shipping_tier,
          items: data.items,
        },
      })
    },
    [gtag, pushDataLayer]
  )

  const trackPurchase = useCallback(
    (data: EcommerceEventData) => {
      fbq("Purchase", {
        content_ids: data.items?.map((i: any) => i.item_id),
        content_type: "product",
        value: data.value,
        currency: data.currency,
        num_items: data.items?.reduce(
          (sum: any, i: any) => sum + (i.quantity || 1),
          0
        ),
      })

      gtag("purchase", {
        transaction_id: data.transaction_id,
        value: data.value,
        currency: data.currency,
        tax: data.tax,
        shipping: data.shipping,
        coupon: data.coupon,
        items: data.items,
      })

      pushDataLayer({
        event: "purchase",
        ecommerce: {
          transaction_id: data.transaction_id,
          value: data.value,
          currency: data.currency,
          tax: data.tax,
          shipping: data.shipping,
          coupon: data.coupon,
          items: data.items,
        },
      })
    },
    [fbq, gtag, pushDataLayer]
  )

  const trackSearch = useCallback(
    (searchTerm: string) => {
      fbq("Search", { search_string: searchTerm })
      gtag("search", { search_term: searchTerm })
      pushDataLayer({ event: "search", search_term: searchTerm })
    },
    [fbq, gtag, pushDataLayer]
  )

  const trackViewItemList = useCallback(
    (
      data: EcommerceEventData & {
        item_list_id?: string
        item_list_name?: string
      }
    ) => {
      fbq("ViewContent", {
        content_type: "product_group",
        content_ids: data.items?.map((i: any) => i.item_id),
      })

      gtag("view_item_list", {
        item_list_id: data.item_list_id,
        item_list_name: data.item_list_name,
        items: data.items,
      })

      pushDataLayer({
        event: "view_item_list",
        ecommerce: {
          item_list_id: data.item_list_id,
          item_list_name: data.item_list_name,
          items: data.items,
        },
      })
    },
    [fbq, gtag, pushDataLayer]
  )

  return {
    trackViewItem,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackAddPaymentInfo,
    trackAddShippingInfo,
    trackPurchase,
    trackSearch,
    trackViewItemList,
    // Low-level for custom events
    fbq,
    gtag,
    pushDataLayer,
  }
}
