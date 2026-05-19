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
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-[1350px] mx-auto px-4 lg:px-8 py-5 lg:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center lg:gap-6">
          {reassurances.map((reassurance) => {
            const redirectUrl = handleRedirect(reassurance)
            const content = (
              <div className="flex flex-row items-center gap-4 group">
                {reassurance.icon_url && (
                  <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                    <Image
                      src={reassurance.icon_url}
                      alt={reassurance.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <h3 className="text-gray-900 text-sm lg:text-[15px] font-semibold tracking-tight">
                    {reassurance.title}
                  </h3>
                  {reassurance.description && (
                    <p className="text-gray-500 text-xs lg:text-[13px] mt-0.5">
                      {reassurance.description}
                    </p>
                  )}
                </div>
              </div>
            )

            const wrapperClasses = "flex-1 flex justify-center lg:justify-start hover:opacity-80 transition-opacity cursor-pointer"

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
