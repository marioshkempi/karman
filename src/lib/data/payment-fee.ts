"use server"

import { revalidateTag } from "next/cache"
import { getCacheTag } from "@lib/data/cookies"
import { sdk } from "@lib/config"

export type PaymentFee = {
  provider_id: string
  provider_name: string
  fee_label: string
  fee_amount: number
  fee_type: "fixed" | "percentage" | "both"
  fixed_amount: number
  percentage: number
  tax_inclusive: boolean
}

/**
 * Payment Fee Server Actions
 *
 * Place at: src/lib/data/payment-fee.ts
 *
 * IMPORTANT: Update the getCacheTag import above to match your project.
 * Common locations:
 *   import { getCacheTag } from "@lib/util/server-cache"
 *   import { getCacheTag } from "@lib/util/get-cache-tag"
 */

export async function applyPaymentFee(
  cartId: string,
  providerId: string,
  feeAmount: number,
  feeLabel: string,
) {
  try {
    const data = await sdk.client.fetch(
      `/store/carts/${cartId}/payment-fee`,
      {
        method: "POST",
        body: {
          provider_id: providerId,
          fee_amount: feeAmount,
          fee_label: feeLabel,
        },
      },
    )

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    return data
  } catch (error: any) {
    console.error("[PaymentFee] Failed to apply:", error.message)
    throw error
  }
}

export async function removePaymentFee(cartId: string) {
  try {
    const data = await sdk.client.fetch(
      `/store/carts/${cartId}/payment-fee`,
      {
        method: "DELETE",
      },
    )

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    return data
  } catch (error: any) {
    console.error("[PaymentFee] Failed to remove:", error.message)
    throw error
  }
}


export async function getPaymentFees(
  cartTotal: number,
  currencyCode: string = "eur",
): Promise<PaymentFee[]> {
  try {
    const data = await sdk.client.fetch<{ payment_fees: PaymentFee[] }>(
      `/store/payment-fees`,
      {
        method: "GET",
        query: {
          cart_total: cartTotal.toString(),
          currency_code: currencyCode,
        },
      },
    )
    return data.payment_fees || []
  } catch (error: any) {
    console.error("[PaymentFee] Failed to fetch:", error.message)
    return []
  }
}