"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "@lib/data/cookies"
import { HttpTypes } from "@medusajs/types"

export const listLocales = async (): Promise<{
  locales: HttpTypes.StoreLocale[]
}> => {
  const next = {
    ...(await getCacheOptions("locales")),
  }

  try {
    // @ts-ignore
    const { locales } = await sdk.store.locale.list({
      // @ts-ignore
      next,
      cache: "force-cache",
    })

    return {
      locales: locales || [],
    }
  } catch (error) {
    console.error("Failed to fetch locales:", error)
    return {
      locales: [],
    }
  }
}
