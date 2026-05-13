import {
  getAuthHeaders,
  getCacheOptions,
  getSimpleCacheOptions,
} from "@lib/data/cookies"
import { sdk } from "@lib/config"

import { CaptchaConfig } from "@modules/captcha/types"

type SiteSetting = {
  key: string
  value: any
}

export const getSiteSetting = async (key: string): Promise<SiteSetting> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // const next = {
  //   ...(await getCacheOptions(`site-setting-${key}`)),
  // }

  try {
    return await sdk.client.fetch<SiteSetting>(
      `/store/site-options?key=${encodeURIComponent(key)}`,
      {
        method: "GET",
        headers,
        next: getSimpleCacheOptions(key),
        cache: "force-cache",
      }
    )
  } catch (error) {
    console.error(`Failed to fetch site setting for key "${key}":`, error)
    // @ts-ignore
    return
  }
}

export const getSiteSettings = async (
  keys: string[]
): Promise<Record<string, any>> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    return await sdk.client.fetch<Record<string, any>>(
      `/store/site-options?key=${keys.map(encodeURIComponent).join(",")}`,
      {
        method: "GET",
        headers,
        next: getSimpleCacheOptions(keys.join("-")),
        cache: "force-cache",
      }
    )
  } catch (error) {
    console.error(
      `Failed to fetch site settings for keys "${keys.join(", ")}":`,
      error
    )
    return {}
  }
}

export const getProductsPerPage = async (): Promise<number> => {
  const value: any = await getSiteSetting("products_per_page")
  if (!value) return 12
  return parseInt(value)
}

export async function getCaptchaConfig(): Promise<CaptchaConfig | null> {
  try {
    const settings = await getSiteSettings([
      "captcha_enabled",
      "captcha_version",
      "captcha_site_key",
      "captcha_protected_forms",
    ])

    if (!settings.captcha_enabled || !settings.captcha_site_key) return null

    const forms =
      typeof settings.captcha_protected_forms === "string"
        ? settings.captcha_protected_forms
            .split(",")
            .map((f: string) => f.trim())
            .filter(Boolean)
        : []

    return {
      enabled: true,
      version: settings.captcha_version || "v2_checkbox",
      site_key: settings.captcha_site_key,
      protected_forms: forms,
    }
  } catch {
    return null
  }
}
