import { Suspense } from "react"
import { getTrackingSettings } from "@lib/data/tracking-scripts"
import FacebookPixel from "./facebook-pixel"
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "./google-tag-manager"
import GoogleAnalytics from "./google-analytics"
import PageViewTracker from "./page-view-tracker"

/**
 * Drop into your root layout.tsx:
 *
 *   import { TrackingScripts, TrackingNoscript } from "@modules/tracking"
 *
 *   <body>
 *     <TrackingNoscript />
 *     {children}
 *     <TrackingScripts />
 *   </body>
 */
export async function TrackingScripts() {
  const tracking = await getTrackingSettings()

  return (
    <>
      {tracking.fb_pixel_enabled && tracking.fb_pixel_id && (
        <FacebookPixel pixelId={tracking.fb_pixel_id} />
      )}

      {tracking.gtm_enabled && tracking.gtm_id && (
        <GoogleTagManager gtmId={tracking.gtm_id} />
      )}

      {tracking.ga4_enabled && tracking.ga4_measurement_id && (
        <GoogleAnalytics measurementId={tracking.ga4_measurement_id} />
      )}

      <Suspense fallback={null}>
        <PageViewTracker tracking={tracking} />
      </Suspense>
    </>
  )
}

export async function TrackingNoscript() {
  const tracking = await getTrackingSettings()

  if (!tracking.gtm_enabled || !tracking.gtm_id) return null

  return <GoogleTagManagerNoscript gtmId={tracking.gtm_id} />
}
