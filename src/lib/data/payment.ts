"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import medusaError from "@lib/util/medusa-error"

// export const listCartPaymentMethods = async (regionId: string) => {
//   const headers = {
//     ...(await getAuthHeaders()),
//   }
//
//   const next = {
//     ...(await getCacheOptions("payment_providers")),
//   }
//
//   return sdk.client
//     .fetch<HttpTypes.StorePaymentProviderListResponse>(
//       `/store/payment-providers`,
//       {
//         method: "GET",
//         query: { region_id: regionId },
//         headers,
//         next,
//         cache: "force-cache",
//       }
//     )
//     .then(({ payment_providers }) =>
//       payment_providers.sort((a, b) => {
//         return a.id > b.id ? 1 : -1
//       })
//     )
//     .catch(() => {
//       return null
//     })
// }
export type PaymentProviderOption = {
  provider_id: string
  display_name: string | null
  description: string | null
  image_url: string | null
  extra_content: string | null
}

// Enriched provider returned from listCartPaymentMethods
export type EnrichedPaymentProvider = HttpTypes.StorePaymentProvider & {
  display_name: string
  description: string | null
  image_url: string | null
  extra_content: string | null
}

export const listCartPaymentMethods = async (
  regionId: string,
  cartId?: string
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  // ── Fetch providers + display options in parallel ──────────────────────────
  const [providers, optionsRes] = await Promise.all([
    (async () => {
      if (cartId) {
        try {
          const { payment_providers } =
            await sdk.client.fetch<HttpTypes.StorePaymentProviderListResponse>(
              "/store/payment-conditions/available",
              {
                method: "GET",
                query: { cart_id: cartId },
                headers,
                next,
              }
            )
          return payment_providers.sort((a, b) => (a.id > b.id ? 1 : -1))
        } catch (error) {
          console.error("Payment conditions fetch failed, falling back:", error)
        }
      }

      // Fallback
      return sdk.client
        .fetch<HttpTypes.StorePaymentProviderListResponse>(
          "/store/payment-providers",
          {
            method: "GET",
            query: { region_id: regionId },
            headers,
            next,
          }
        )
        .then(({ payment_providers }) =>
          payment_providers.sort((a, b) => (a.id > b.id ? 1 : -1))
        )
        .catch(() => null)
    })(),

    sdk.client
      .fetch<{ payment_provider_options: PaymentProviderOption[] }>(
        "/store/payment-provider-options",
        {
          method: "GET",
          headers,
          next,
        }
      )
      .catch(() => ({ payment_provider_options: [] })), // never block checkout
  ])
  // ──────────────────────────────────────────────────────────────────────────

  if (!providers) return null

  const optionsMap = Object.fromEntries(
    optionsRes.payment_provider_options.map((o: any) => [o.provider_id, o])
  )

  // Merge display options into each provider
  return providers.map((provider: any) => ({
    ...provider,
    display_name: optionsMap[provider.id]?.display_name ?? provider.id,
    description: optionsMap[provider.id]?.description ?? null,
    image_url: optionsMap[provider.id]?.image_url ?? null,
    extra_content: optionsMap[provider.id]?.extra_content ?? null,
  }))
}

export const authorizePaymentSession = async ({
  paymentCollectionId,
  paymentSessionId,
}: {
  paymentCollectionId: string
  paymentSessionId: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch(
      `/store/payment-collections/${paymentCollectionId}/payment-sessions/${paymentSessionId}/authorize`,
      {
        method: "POST",
        headers,
      }
    )
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return resp
    })
    .catch(medusaError)
}
