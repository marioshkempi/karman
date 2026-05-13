"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions, removeCartId } from "./cookies"
import { HttpTypes } from "@medusajs/types"
import { setCartId } from "./cookies"

export const retrieveOrder = async (id: string, clearCart?: boolean) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }
  if (clearCart) {
    await removeCartId()
  }
  return sdk.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ order }) => order)
    .catch((err) => medusaError(err))
}

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
) => {
  const headers = {
    ...(await getAuthHeaders()), // uses cookies → dynamic
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,+items.metadata,*items.variant,*items.product",
        ...filters,
      },
      headers,
      cache: "no-store", // ✅ REQUIRED
    })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err))
}

export const listOrders1 = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,+items.metadata,*items.variant,*items.product",
        ...filters,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err))
}

export const createTransferRequest = async (
  state: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: HttpTypes.StoreOrder | null
}> => {
  const id = formData.get("order_id") as string

  if (!id) {
    return { success: false, error: "Order ID is required", order: null }
  }

  const headers = await getAuthHeaders()

  return await sdk.store.order
    .requestTransfer(
      id,
      {},
      {
        fields: "id, email",
      },
      headers
    )
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const acceptTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const declineTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const reorder = async (id: string) => {
  const headers = await getAuthHeaders()

  const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
    `/store/customers/me/orders/${id}`,
    {
      method: "POST",
      headers,
    }
  )

  await setCartId(cart.id)

  return cart
}

export async function sendOrderMessage(
  orderId: string,
  message: string,
  title: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    if (!message.trim()) {
      return { success: false, error: "Το μήνυμα δεν μπορεί να είναι κενό." }
    }

    const authHeaders = await getAuthHeaders()

    return await sdk.client.fetch<{
      success: boolean
      message?: string
      error?: string
    }>(`/store/order/${orderId}/messages/send`, {
      method: "POST",
      headers: authHeaders,
      body: {
        message,
        title,
      },
    })
  } catch (error: any) {
    console.error("Error sending order message:", error)
    return {
      success: false,
      error: error?.message || "Αποτυχία αποστολής. Παρακαλώ δοκιμάστε ξανά.",
    }
  }
}

export async function getOrderMessages(
  orderId: string
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const authHeaders = await getAuthHeaders()

    return await sdk.client.fetch<{
      success: boolean
      data?: any[]
      error?: string
    }>(`/store/order/${orderId}/messages`, {
      method: "GET",
      headers: authHeaders,
    })
  } catch (error: any) {
    console.error("Error fetching order messages:", error)
    return {
      success: false,
      error:
        error?.message ||
        "Αποτυχία φόρτωσης μηνυμάτων. Παρακαλώ δοκιμάστε ξανά.",
    }
  }
}
