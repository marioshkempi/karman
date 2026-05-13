import { sdk } from "@lib/config"

/**
 * Fetch ACS pickup point locations from the backend
 */
export async function getAcsPointLocations() {
  try {
    const data: any = await sdk.client.fetch("/store/acspoints/locations", {
      method: "GET",
    })
    return {
      points: data.points || [],
      meta: data.meta || [],
    }
  } catch (err) {
    console.error("Failed to fetch ACS points locations:", err)
    return { points: [], meta: [] }
  }
}

/**
 * Save ACS point selection for a cart
 */
export async function addAcsPointEntry(
  cartId: string,
  storeId: string,
  storeContent: Record<string, any> | string,
) {
  return sdk.client.fetch("/store/acspoints", {
    method: "POST",
    body: {
      cart_id: cartId,
      store_id: storeId,
      store_content:
        typeof storeContent === "string"
          ? storeContent
          : JSON.stringify(storeContent),
    },
  })
}

/**
 * Get ACS point selection for a cart
 */
export async function getAcsPointEntry(cartId: string) {
  try {
    const data: any = await sdk.client.fetch(
      `/store/acspoints?cart_id=${cartId}`,
      { method: "GET" },
    )
    return data.acspoints_cart ?? null
  } catch {
    return null
  }
}

/**
 * Delete ACS point selection for a cart
 */
export async function deleteAcsPointEntry(cartId: string) {
  return sdk.client.fetch(`/store/acspoints?cart_id=${cartId}`, {
    method: "DELETE",
  })
}