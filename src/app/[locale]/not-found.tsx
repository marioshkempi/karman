import { ArrowUpRightMini } from "@medusajs/icons"
import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: "404",
  description: "Η σελίδα δεν βρέθηκε",
}

export default async function NotFound() {
  const t = await getTranslations()

  return (
    <main className="grid min-h-[calc(100vh-64px)] place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-primary">404</p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
          {t("notFound.title")}
        </h1>

        <p className="mt-6 text-lg font-medium text-gray-500 sm:text-xl">
          {t("notFound.message")}
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <LocalizedClientLink
            href="/"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-secondary"
          >
            {t("notFound.backHome")}
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/contact-us"
            className="text-sm font-semibold text-gray-900 flex items-center gap-x-1 group"
          >
            {t("notFound.contactSupport")}
            <ArrowUpRightMini
              className="group-hover:rotate-45 transition duration-150"
            />
          </LocalizedClientLink>
        </div>
      </div>
    </main>
  )
}
