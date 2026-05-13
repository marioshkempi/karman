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
    //console.log("No reassurances to display - component will not render")
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
    <div className="w-full bg-white mb-6 lg:mb-8">
      <div className="max-w-[1350px] mx-auto px-0 lg:px-8">
        <div className="flex flex-col gap-1 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-6">
          {reassurances.map((reassurance) => {
            const redirectUrl = handleRedirect(reassurance)
            const content = (
              <div className="flex flex-row items-center gap-4 p-3 hover:opacity-80 transition-opacity w-full lg:flex-col lg:items-center lg:text-center lg:gap-0 lg:p-4">
                {reassurance.icon_url && (
                  <div className="flex-shrink-0 lg:mb-4">
                    <Image
                      src={reassurance.icon_url}
                      alt={reassurance.title}
                      width={64}
                      height={64}
                      className="lg:w-16 lg:h-16 object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-col lg:items-center">
                  <h3 className="text-primary text-[20px] lg:text-base font-medium mb-1 lg:mb-2">
                    {reassurance.title}
                  </h3>
                  {reassurance.description && (
                    <p className="text-secondary text-[16px] lg:text-sm">
                      {reassurance.description}
                    </p>
                  )}
                </div>
              </div>
            )

            const wrapperClasses =
              "w-full lg:w-[calc(25%-1.125rem)] xl:w-[calc(25%-1.5rem)] flex justify-center lg:max-w-[300px]"

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
