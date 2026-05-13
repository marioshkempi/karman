"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { TrackingSettings } from "@constants/tracking"

type Props = {
  tracking: TrackingSettings
}

export default function PageViewTracker({ tracking }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "")

    // Facebook Pixel
    if (tracking.fb_pixel_enabled && tracking.fb_pixel_id && window.fbq) {
      window.fbq("track", "PageView")
    }

    // GA4 / gtag
    if (tracking.ga4_enabled && tracking.ga4_measurement_id && window.gtag) {
      window.gtag("config", tracking.ga4_measurement_id, {
        page_path: url,
      })
    }

    // GTM dataLayer
    if (tracking.gtm_enabled && tracking.gtm_id && window.dataLayer) {
      window.dataLayer.push({
        event: "page_view",
        page_path: url,
      })
    }
  }, [pathname, searchParams, tracking])

  return null
}
