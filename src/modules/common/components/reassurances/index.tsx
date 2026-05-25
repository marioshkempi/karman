import Image from "next/image"
import { listReassurances, StoreReassurance } from "@lib/data/reassurances"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ReassurancesProps {
  language?: string
  page_type?: "home" | "product" | "cart"
}

export default async function Reassurances({
  language,
  page_type,
}: ReassurancesProps) {
  const { reassurances } = await listReassurances({
    language,
    page_type,
  })

  if (!reassurances || reassurances.length === 0) {
    return null
  }

  const handleRedirect = (reassurance: StoreReassurance) => {
    if (!reassurance.redirect_type || !reassurance.redirect_value) {
      return null
    }

    switch (reassurance.redirect_type) {
      case "product":
        return `/products/${reassurance.redirect_value}`
      case "category":
        return `/${reassurance.redirect_value}`
      case "page":
        return `/${reassurance.redirect_value}`
      case "url":
        return reassurance.redirect_value
      default:
        return null
    }
  }

  return (
    <div className="w-full bg-white py-4 lg:py-8 border-b border-gray-100">
      <div className="max-w-[1350px] mx-auto px-4 lg:px-8">
        {/* Mobile: horizontal scroll row */}
        <div className="flex lg:hidden overflow-x-auto gap-4 pb-2 -mx-4 px-4 scrollbar-hide">
          {reassurances.map((reassurance) => {
            const redirectUrl = handleRedirect(reassurance)
            const content = (
              <div className="flex flex-row items-center gap-2 p-2 min-w-[140px] hover:opacity-80 transition-opacity">
                {reassurance.icon_url && (
                  <div className="flex-shrink-0">
                    <Image
                      src={reassurance.icon_url}
                      alt={reassurance.title}
                      width={36}
                      height={36}
                      className="w-9 h-9 object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <h3 className="text-[#283882] text-xs font-semibold whitespace-nowrap">
                    {reassurance.title}
                  </h3>
                  {reassurance.description && (
                    <p className="text-gray-500 text-[10px] whitespace-nowrap">
                      {reassurance.description}
                    </p>
                  )}
                </div>
              </div>
            )

            if (redirectUrl) {
              if (
                reassurance.redirect_type === "url" &&
                redirectUrl.startsWith("http")
              ) {
                return (
                  <a
                    key={reassurance.id}
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    {content}
                  </a>
                )
              }
              return (
                <LocalizedClientLink
                  key={reassurance.id}
                  href={redirectUrl}
                  className="flex-shrink-0"
                >
                  {content}
                </LocalizedClientLink>
              )
            }

            return (
              <div key={reassurance.id} className="flex-shrink-0">
                {content}
              </div>
            )
          })}
        </div>

        {/* Desktop: flex row layout */}
        <div className="hidden lg:flex lg:flex-row lg:justify-between lg:items-center lg:gap-8">
          {reassurances.map((reassurance) => {
            const redirectUrl = handleRedirect(reassurance)
            const content = (
              <div className="flex flex-row items-center gap-4 p-2 hover:opacity-80 transition-opacity">
                {reassurance.icon_url && (
                  <div className="flex-shrink-0">
                    <Image
                      src={reassurance.icon_url}
                      alt={reassurance.title}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <h3 className="text-[#283882] text-base font-semibold">
                    {reassurance.title}
                  </h3>
                  {reassurance.description && (
                    <p className="text-gray-500 text-sm">
                      {reassurance.description}
                    </p>
                  )}
                </div>
              </div>
            )

            const wrapperClasses = "flex-1 flex justify-center"

            if (redirectUrl) {
              if (
                reassurance.redirect_type === "url" &&
                redirectUrl.startsWith("http")
              ) {
                return (
                  <a
                    key={reassurance.id}
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={wrapperClasses}
                  >
                    {content}
                  </a>
                )
              }
              return (
                <LocalizedClientLink
                  key={reassurance.id}
                  href={redirectUrl}
                  className={wrapperClasses}
                >
                  {content}
                </LocalizedClientLink>
              )
            }

            return (
              <div key={reassurance.id} className={wrapperClasses}>
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
