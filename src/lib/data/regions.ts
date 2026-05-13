"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { cookies } from "next/headers"
import {COUNTRY_COOKIE} from "@constants/global"


export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async () => {
  try {
    const cookieStore = await cookies()
    const countryCode = cookieStore
      .get(COUNTRY_COOKIE)
      ?.value?.toLowerCase()

    // 1. If region already cached, return it
    if (countryCode && regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    // 2. Fetch regions from Medusa
    const regions = await listRegions()
    if (!regions) {
      return null
    }

    // 3. Build country → region map
    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        if (c?.iso_2) {
          regionMap.set(c.iso_2.toLowerCase(), region)
        }
      })
    })

    // 4. Resolve region
    if (countryCode && regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    // 5. Fallback (safe default)
    return regionMap.get("us") ?? regions[0] ?? null
  } catch (e) {
    return null
  }
}

export const getRegion1 = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()
    // console.log(regions)
    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region
  } catch (e: any) {
    return null
  }
}
