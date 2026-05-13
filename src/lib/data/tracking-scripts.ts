import { cache } from "react"
import { getSiteSettings } from "@lib/data/site-settings"
import { TrackingSettings } from "@constants/tracking"

async function _getTrackingSettings(): Promise<TrackingSettings> {
  try {
    const settings = await getSiteSettings([
      "fb_pixel_id",
      "fb_pixel_enabled",
      "gtm_id",
      "gtm_enabled",
      "ga_measurement_id",
      "ga4_enabled",
    ])

    return {
      fb_pixel_id: settings.fb_pixel_id || null,
      fb_pixel_enabled:
        settings.fb_pixel_enabled !== "false" &&
        settings.fb_pixel_enabled !== false,
      gtm_id: settings.gtm_id || null,
      gtm_enabled:
        settings.gtm_enabled !== "false" && settings.gtm_enabled !== false,
      ga4_measurement_id: settings.ga_measurement_id || null,
      ga4_enabled:
        settings.ga4_enabled !== "false" && settings.ga4_enabled !== false,
    }
  } catch (error) {
    console.error("[getTrackingSettings] Failed:", error)
    return {
      fb_pixel_id: null,
      fb_pixel_enabled: false,
      gtm_id: null,
      gtm_enabled: false,
      ga4_measurement_id: null,
      ga4_enabled: false,
    }
  }
}

/**
 * Cached per request — call from any server component or layout.
 */
export const getTrackingSettings = cache(_getTrackingSettings)
