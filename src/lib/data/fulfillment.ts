"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listCartShippingMethods = async (cartId: string) => {
  // 1. Fetch both datasets concurrently for better performance
  const [shippingOptions, settingsResponse] = await Promise.all([
    getCartShippingMethods(cartId),
    listShippingOptionsSettings(cartId),
  ])

  if (!shippingOptions) return []

  const settingsMap = new Map<string, any>()

  // @ts-ignore
  const configs = settingsResponse?.configs || []
  configs.forEach((config: any) => {
    settingsMap.set(config.shipping_option_id, {
      image_url: config.image_url,
      description: config.description,
      tracking_url: config.tracking_url,
    })
  })

  return shippingOptions.map((option: any) => {
    const settings = settingsMap.get(option.id)

    return {
      ...option,
      metadata: {
        ...(option.metadata || {}),
        ...settings,
      },
    }
  })
}

export const getCartShippingMethods = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: {
          cart_id: cartId,
        },
        headers,
        next,
        // cache: "force-cache",
      }
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
}

export const listShippingOptionsSettings = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment-settings")),
  }

  return sdk.client.fetch(`/store/shipping-options/config`, {
    method: "GET",
    query: {
      cart_id: cartId,
    },
    headers,
    next,
  })
}

export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("fulfillment")),
  }

  const body = { cart_id: cartId, data }

  if (data) {
    body.data = data
  }

  return sdk.client
    .fetch<{ shipping_option: HttpTypes.StoreCartShippingOption }>(
      `/store/shipping-options/${optionId}/calculate`,
      {
        method: "POST",
        body,
        headers,
        next,
      }
    )
    .then(({ shipping_option }) => shipping_option)
    .catch((e) => {
      return null
    })
}
