import { listFooterSections } from "@lib/data/footer-links"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FooterAccordionItem from "@modules/layout/components/footer-accordion-item"
import FooterHardcode from "@modules/layout/components/footer-hardcode"
import { getSiteSetting } from "@lib/data/site-settings"
import ContentBlockRenderer from "@modules/common/components/content-block/content-block"
import { getTranslations } from "next-intl/server"
import { MapPin, Phone, Mail } from "lucide-react"

const normalizeUrl = (url: string | null | undefined): string => {
  if (!url || url.trim() === "") {
    return "#"
  }

  const trimmedUrl = url.trim()

  if (
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://") ||
    trimmedUrl.startsWith("mailto:") ||
    trimmedUrl.startsWith("tel:")
  ) {
    return trimmedUrl
  }

  if (trimmedUrl.startsWith("/")) {
    return trimmedUrl
  }

  return `/${trimmedUrl}`
}

export default async function Footer({ topbarText }: any) {
  const t = await getTranslations()
  const { sections } = await listFooterSections()
  const currentYear = new Date().getFullYear()
  const hasDynamicData = sections && sections.length > 0
  const footerLogo: any = await getSiteSetting("footer_logo")

  if (!hasDynamicData) {
    return <FooterHardcode />
  }

  const activeSections = sections || []

  return (
    <footer className="bg-[#1a1a1a]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        {/* Mobile + Tablet accordion */}
        <div className="lg:hidden space-y-6">
          <div className="flex items-center mb-6">
            <LocalizedClientLink href="/">
              <img
                src={footerLogo}
                width={200}
                height={73}
                alt={"Footer logo"}
                className="w-auto h-auto max-w-[200px]"
              />
            </LocalizedClientLink>
          </div>
          <div className="space-y-2">
            {activeSections.map((section) => {
              const links = section.links || []

              return (
                <FooterAccordionItem key={section.id} title={section.title}>
                  {section.title === "Στοιχεία Επικοινωνίας" ? (
                    <div className="space-y-2 text-sm text-gray-400">
                      {links.map((link) => {
                        const linkUrl = normalizeUrl(link.url)
                        const isClickable = link.url && link.url.trim() !== ""

                        return (
                          <div key={link.id} className="flex items-start gap-2">
                            {isClickable ? (
                              <LocalizedClientLink
                                href={linkUrl}
                                className="text-gray-300 hover:text-white transition-colors"
                              >
                                {link.label}
                              </LocalizedClientLink>
                            ) : (
                              <span className="text-gray-300">
                                {link.label}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <ul className="space-y-2 text-sm text-gray-400">
                      {links.map((link) => {
                        const linkUrl = normalizeUrl(link.url)
                        const isClickable = link.url && link.url.trim() !== ""

                        return (
                          <li key={link.id}>
                            {isClickable ? (
                              <LocalizedClientLink
                                href={linkUrl}
                                className="hover:text-white transition-colors"
                              >
                                {link.label}
                              </LocalizedClientLink>
                            ) : (
                              <span>{link.label}</span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </FooterAccordionItem>
              )
            })}
          </div>
        </div>

        {/* Desktop columns */}
        <div className="hidden lg:flex gap-12">
          {/* Logo column */}
          <div className="w-[20%]">
            <LocalizedClientLink href="/">
              <img
                src={footerLogo}
                width={200}
                height={73}
                alt={"Footer logo"}
                className="w-auto h-auto max-w-[200px]"
              />
            </LocalizedClientLink>
          </div>

          {/* Link columns */}
          <div className="flex-1 grid grid-cols-4 gap-8">
            {activeSections.slice(0, 4).map((section) => {
              const links = section.links || []

              return (
                <div key={section.id}>
                  {(() => {
                    const sectionUrl = normalizeUrl(section.url)
                    const isSectionClickable =
                      section.url && section.url.trim() !== ""

                    return isSectionClickable ? (
                      <LocalizedClientLink
                        href={sectionUrl}
                        className="text-white font-semibold text-base mb-4 block hover:text-gray-300 transition-colors"
                      >
                        {section.title}
                      </LocalizedClientLink>
                    ) : (
                      <h3 className="text-white font-semibold text-base mb-4">
                        {section.title}
                      </h3>
                    )
                  })()}
                  <ul className="space-y-2">
                    {links.map((link) => {
                      const linkUrl = normalizeUrl(link.url)
                      const isClickable = link.url && link.url.trim() !== ""

                      return (
                        <li key={link.id}>
                          {isClickable ? (
                            <LocalizedClientLink
                              href={linkUrl}
                              className="text-gray-400 text-sm hover:text-white transition-colors"
                            >
                              {link.label}
                            </LocalizedClientLink>
                          ) : (
                            <span className="text-gray-400 text-sm">{link.label}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contact Info Row */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>

            {/* Contact Items */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>Φαρσάλων 11, Λάρισα, Ελλάδα</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-gray-600" />
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="w-5 h-5 text-gray-400" />
                <a href="tel:2410232019" className="hover:text-white transition-colors">Τηλ: 2410232019</a>
              </div>
              <div className="hidden md:block w-px h-6 bg-gray-600" />
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:info@aglopoulos-racing.gr" className="hover:text-white transition-colors">e-mail: info@aglopoulos-racing.gr</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              e-mail: info@aglopoulos-racing.gr
            </p>
            {/* Payment Icons */}
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5 w-auto brightness-0 invert opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 w-auto brightness-0 invert opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 w-auto brightness-0 invert opacity-70" />
              <span className="text-gray-400 text-xs font-bold">Klarna.</span>
              <span className="text-gray-400 text-xs">G Pay</span>
              <span className="text-gray-400 text-xs">Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
