import { getBaseURL } from "@lib/util/env"
import "styles/globals.css"
import { Toaster } from "@medusajs/ui"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { getCaptchaConfig, getSiteSetting } from "@lib/data/site-settings"
import Script from "next/script"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { routing } from "@i18n/routing"
import { notFound } from "next/navigation"
import { TrackingNoscript, TrackingScripts } from "@modules/tracking"
import { TooltipProvider } from "@medusajs/ui"
import { SkroutzAnalytics } from "@modules/tracking/skroutz-analytics/skroutz-analytics"
import { CaptchaProvider } from "@modules/captcha/captcha-context"
import { Manrope } from "next/font/google"

const manrope = Manrope({
  subsets: ["latin", "greek"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl: any = "/favicon.ico"

  try {
    const favicon = await getSiteSetting("site_favicon")
    faviconUrl = favicon || "/favicon.ico"
  } catch {}

  return {
    icons: {
      icon: faviconUrl,
    },
  }
}
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  const skroutzConfig: any = await getSiteSetting("skroutz_config")
  const captchaConfig = await getCaptchaConfig()

  return (
    <html lang={locale} data-mode="light" className={manrope.variable}>
      <head />

      <body className={manrope.className}>
        <NextIntlClientProvider>
          <CaptchaProvider config={captchaConfig}>
            <TrackingNoscript />
            <TooltipProvider>
              <main className="relative">{children}</main>
            </TooltipProvider>
            <TrackingScripts />
            <SkroutzAnalytics config={skroutzConfig} />
            <Toaster />
          </CaptchaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
