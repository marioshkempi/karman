import Image from "next/image"
import { listReassurances, StoreReassurance } from "@lib/data/reassurances"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface ReassurancesProps {
  language?: string
  page_type?: "home" | "product" | "cart"
}

// Static fallback trust badges for when no data from API
const STATIC_TRUST_BADGES = [
  {
    id: "1",
    icon: "/images/icons/trust-badge-1.png",
    title: "Εγγύηση Συμβατότητας",
    description: "Τα προϊόντα που θα παραλάβετε θα είναι αυτά που θέλατε",
  },
  {
    id: "2",
    icon: "/images/icons/trust-badge-2.png",
    title: "Ασφαλείς Πληρωμές",
    description: "Ασφαλείς αγορές μέσω πιστωτικής κάρτας",
  },
  {
    id: "3",
    icon: "/images/icons/trust-badge-3.png",
    title: "Premium Quality",
    description: "Ταχύτατες αποστολές εντός 1-3 ημερών",
  },
]

export default async function Reassurances({
  language,
  page_type,
}: ReassurancesProps) {
  const { reassurances } = await listReassurances({
    language,
    page_type,
  })

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

  // Use API data if available, otherwise use static fallback
  const hasApiData = reassurances && reassurances.length > 0

  return (
    <div className="w-full bg-white py-8 lg:py-10 border-b border-gray-100">
      <div className="max-w-[1350px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
          {hasApiData ? (
            // Render API data
            reassurances.map((reassurance) => {
              const redirectUrl = handleRedirect(reassurance)
              const content = (
                <div className="flex flex-row items-center gap-4 p-3 hover:opacity-90 transition-opacity">
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
                    <h3 className="text-gray-900 text-[15px] lg:text-[16px] font-semibold mb-0.5">
                      {reassurance.title}
                    </h3>
                    {reassurance.description && (
                      <p className="text-gray-500 text-[13px] lg:text-[14px] leading-snug">
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
                      className="flex justify-center"
                    >
                      {content}
                    </a>
                  )
                }
                return (
                  <LocalizedClientLink
                    key={reassurance.id}
                    href={redirectUrl}
                    className="flex justify-center"
                  >
                    {content}
                  </LocalizedClientLink>
                )
              }

              return (
                <div key={reassurance.id} className="flex justify-center">
                  {content}
                </div>
              )
            })
          ) : (
            // Render static fallback badges
            STATIC_TRUST_BADGES.map((badge) => (
              <div key={badge.id} className="flex justify-center">
                <div className="flex flex-row items-center gap-4 p-3">
                  <div className="flex-shrink-0">
                    <img
                      src={badge.icon}
                      alt={badge.title}
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-gray-900 text-[15px] lg:text-[16px] font-semibold mb-0.5">
                      {badge.title}
                    </h3>
                    <p className="text-gray-500 text-[13px] lg:text-[14px] leading-snug">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
