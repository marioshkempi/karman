import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,

    // Optional: Configure time zone
    timeZone: "Europe/Athens",
    now: new Date(),

    // Optional: Number and date formatting
    formats: {
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
        long: {
          day: "numeric",
          month: "long",
          year: "numeric",
          weekday: "long",
        },
      },
      number: {
        currency: {
          style: "currency",
          currency: "EUR",
          currencyDisplay: "symbol",
        },
        precise: {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        },
      },
    },
  }
})
