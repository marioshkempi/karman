"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { revalidateTag } from "next/cache"

export interface WishlistItem {
  id: string
  wishlist_id: string
  product_variant_id: string
  product_variant: any
  created_at: string
  updated_at: string
}

export interface Wishlist {
  id: string
  customer_id: string
  sales_channel_id: string
  items: WishlistItem[]
  created_at: string
  updated_at: string
}

export const getCustomerWishlist = async (): Promise<Wishlist | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("wishlists")),
  }

  try {
    const { wishlist } = await sdk.client.fetch<{ wishlist: Wishlist }>(
      `/store/customers/me/wishlists`,
      {
        method: "GET",
        headers,
        next,
      }
    )

    return wishlist
  } catch (error) {
    return null
  }
}

export const createWishlist = async (): Promise<Wishlist | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const { wishlist } = await sdk.client.fetch<{ wishlist: Wishlist }>(
      `/store/customers/me/wishlists`,
      {
        method: "POST",
        headers,
      }
    )

    revalidateTag("wishlists")
    return wishlist
  } catch (error) {
    console.error("Error creating wishlist:", error)
    return null
  }
}

export const addWishlistItem = async (
  variantId: string
): Promise<Wishlist | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const { wishlist } = await sdk.client.fetch<{ wishlist: Wishlist }>(
      `/store/customers/me/wishlists/items`,
      {
        method: "POST",
        headers,
        body: {
          variant_id: variantId,
        },
      }
    )

    revalidateTag("wishlists")
    return wishlist
  } catch (error: any) {
    if (error?.status === 404) {
      const newWishlist = await createWishlist()
      if (newWishlist) {
        return await addWishlistItem(variantId)
      }
    }
    console.error("Error adding wishlist item:", error)
    return null
  }
}

export const removeWishlistItem = async (
  itemId: string
): Promise<Wishlist | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const { wishlist } = await sdk.client.fetch<{ wishlist: Wishlist }>(
      `/store/customers/me/wishlists/items/${itemId}`,
      {
        method: "DELETE",
        headers,
      }
    )

    revalidateTag("wishlists")
    return wishlist
  } catch (error) {
    console.error("Error removing wishlist item:", error)
    return null
  }
}

export const shareWishlist = async (): Promise<string | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const { token } = await sdk.client.fetch<{ token: string }>(
      `/store/customers/me/wishlists/share`,
      {
        method: "POST",
        headers,
      }
    )

    return token
  } catch (error) {
    console.error("Error sharing wishlist:", error)
    return null
  }
}

export const getWishlistByToken = async (
  token: string
): Promise<Wishlist | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("wishlists")),
  }

  try {
    const { wishlist } = await sdk.client.fetch<{ wishlist: Wishlist }>(
      `/store/wishlists/${token}`,
      {
        method: "GET",
        headers,
        next,
      }
    )

    return wishlist
  } catch (error) {
    console.error("Error fetching wishlist by token:", error)
    return null
  }
}

export const isInWishlist = async (variantId: string): Promise<boolean> => {
  const wishlist = await getCustomerWishlist()
  
  if (!wishlist) {
    return false
  }

  return wishlist.items.some((item) => item.product_variant_id === variantId)
}

export const getWishlistCount = async (): Promise<number> => {
  const wishlist = await getCustomerWishlist()
  
  if (!wishlist) {
    return 0
  }

  return wishlist.items.length
}

export const getWishlistItemId = async (variantId: string): Promise<string | null> => {
  const wishlist = await getCustomerWishlist()
  
  if (!wishlist) {
    return null
  }

  const item = wishlist.items.find((item) => item.product_variant_id === variantId)
  return item?.id || null
}

export const toggleWishlistItem = async (variantId: string): Promise<{ success: boolean; isInWishlist: boolean }> => {
  try {
    const wishlist = await getCustomerWishlist()
    
    if (!wishlist) {
      await addWishlistItem(variantId)
      return { success: true, isInWishlist: true }
    }

    const existingItem = wishlist.items.find((item) => item.product_variant_id === variantId)
    
    if (existingItem) {
      await removeWishlistItem(existingItem.id)
      return { success: true, isInWishlist: false }
    } else {
      await addWishlistItem(variantId)
      return { success: true, isInWishlist: true }
    }
  } catch (error) {
    console.error("Error toggling wishlist item:", error)
    return { success: false, isInWishlist: false }
  }
}