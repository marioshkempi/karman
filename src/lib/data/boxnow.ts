"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import medusaError from "@lib/util/medusa-error"

export interface BoxnowEntry {
  cart_id: number
  order_id: number | null
  locker_id: string | null
  locker_name: string | null
  locker_address: string | null
  locker_post_code: string | null
  warehouse_id: string | null
  payment_type: string
  vouchers: number
  parcel_ids: string | null
  submitted: string
}

export async function addBoxnowEntry(
  cart_id: string,
  order_id: string,
  locker_id: any,
  locker_name: string,
  locker_address: any,
  locker_post_code: any,
  warehouse_id: any,
  payment_type: any,
  vouchers: any,
  parcel_ids: any,
  submitted: any
) {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
  }

  try {
    await sdk.client.fetch(`/store/boxnow`, {
      method: "POST",
      body: {
        cart_id,
        order_id,
        locker_id,
        locker_name,
        locker_address,
        locker_post_code,
        warehouse_id,
        payment_type,
        vouchers,
        parcel_ids,
        submitted,
      },
      headers,
    })
  } catch (error) {
    medusaError(error)
  }
}

export async function getBoxnowEntry(cart_id: string) {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
  }
  try {
    const boxnowresponse: any = await sdk.client.fetch(
      `/store/boxnow/${cart_id}`,
      {
        method: "GET",
        headers,
      }
    )
    // console.log(boxnowresponse)
    return boxnowresponse.boxnowEntry[0]
  } catch (error) {
    medusaError(error)
    return { success: false, error }
  }
}
