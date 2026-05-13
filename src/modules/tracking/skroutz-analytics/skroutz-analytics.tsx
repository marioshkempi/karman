"use client"

import Script from "next/script"

declare global {
  interface Window {
    skroutz_analytics: (...args: any[]) => void
  }
}

type SkroutzConfig = {
  enabled: boolean
  shop_account_id: string
  merchant_id?: string
  tracking_url?: string
  analytics_url?: string
}

export function SkroutzAnalytics({ config }: { config: SkroutzConfig | null }) {
  if (!config?.enabled || !config?.shop_account_id) return null

  const analyticsUrl =
    config.analytics_url || "https://analytics.skroutz.gr/analytics.min.js"

  return (
    <Script
      id="skroutz-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
                    (function(a,b,c,d,e,f,g){a['SkroutzAnalyticsObject']=e;a[e]=a[e]||function(){
                    (a[e].q=a[e].q||[]).push(arguments);};f=b.createElement(c);f.async=true;
                    f.src=d;g=b.getElementsByTagName(c)[0];g.parentNode.insertBefore(f,g);
                    })(window,document,'script','${analyticsUrl}','skroutz_analytics');
                    skroutz_analytics('session', 'connect', '${config.shop_account_id}');
                `,
      }}
    />
  )
}
