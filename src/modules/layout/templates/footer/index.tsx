import { listFooterSections } from "@lib/data/footer-links"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import FooterAccordionItem from "@modules/layout/components/footer-accordion-item"
import FooterHardcode from "@modules/layout/components/footer-hardcode"
import { getSiteSetting } from "@lib/data/site-settings"
import ContentBlockRenderer from "@modules/common/components/content-block/content-block"
import { getTranslations } from "next-intl/server"

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
  const totalSections = activeSections.length
  const getTargetColumnIndex = () => {
    if (totalSections <= 5) {
      return Math.min(2, totalSections - 1)
    }
    if (totalSections <= 8) {
      return Math.min(5, totalSections - 1)
    }
    const multipleOf3 = Math.floor(totalSections / 3) * 3
    return Math.min(multipleOf3 - 1, totalSections - 1)
  }
  const targetColumnIndex = getTargetColumnIndex()

  return (
    <footer className="bg-primary antialiased dark:bg-gray-800">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-4 py-12 lg:py-16">
        {/* Mobile + Tablet accordion */}
        <div className="lg:hidden space-y-6">
          <div className="flex items-center mb-6">
            <LocalizedClientLink href="/">
              <Image
                src={footerLogo}
                width={235}
                height={86}
                alt={"Bio kifisia footer logo"}
              />
            </LocalizedClientLink>
          </div>
          <div className="space-y-2">
            {activeSections.map((section) => {
              const links = section.links || []

              return (
                <FooterAccordionItem key={section.id} title={section.title}>
                  {section.title === "Στοιχεία Επικοινωνίας" ? (
                    <div className="space-y-2 text-[13px] text-gray-300">
                      {links.map((link) => {
                        const linkUrl = normalizeUrl(link.url)
                        const isClickable = link.url && link.url.trim() !== ""

                        return (
                          <div key={link.id} className="flex items-start gap-2">
                            {isClickable ? (
                              <LocalizedClientLink
                                href={linkUrl}
                                className="text-white font-noto-sans hover:font-bold"
                              >
                                {link.label}
                              </LocalizedClientLink>
                            ) : (
                              <span className="text-white font-noto-sans">
                                {link.label}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <ul className="space-y-2 text-[13px] text-white font-noto-sans">
                      {links.map((link) => {
                        const linkUrl = normalizeUrl(link.url)
                        const isClickable = link.url && link.url.trim() !== ""

                        return (
                          <li key={link.id}>
                            {isClickable ? (
                              <LocalizedClientLink
                                href={linkUrl}
                                className="hover:font-bold transition-all ease-in-out duration-300"
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
            <div className="space-y-2 pt-4">
              <p className="text-[14px] text-white font-noto-sans">
                {t("footer.emailLabel")}{" "}
                <a
                  href="mailto:info@bio-kifisia.gr"
                  className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-out hover:after:w-full"
                >
                  info@bio-kifisia.gr
                </a>
              </p>
              <p className="text-[14px] text-white font-noto-sans">
                {t("footer.phoneLabel")}{" "}
                <a
                  href="tel:2108013428"
                  className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-out hover:after:w-full"
                >
                  210-80 13 428
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Desktop columns */}
        <div className="flex">
          <div className="items-center gap-4 mb-4 w-[30%] hidden lg:block">
            <LocalizedClientLink href="/">
              <Image
                src={footerLogo}
                width={235}
                height={86}
                alt={"Bio kifisia footer logo"}
              />
            </LocalizedClientLink>
          </div>

          <div className="w-[70%] hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {activeSections.map((section, index) => {
              const links = section.links || []
              const shouldShowShippingText = index === targetColumnIndex

              return (
                <div
                  key={section.id}
                  className={`flex flex-col ${
                    shouldShowShippingText ? "justify-between" : ""
                  }`}
                >
                  <div className="space-y-4">
                    {(() => {
                      const sectionUrl = normalizeUrl(section.url)
                      const isSectionClickable =
                        section.url && section.url.trim() !== ""

                      return isSectionClickable ? (
                        <LocalizedClientLink
                          href={sectionUrl}
                          className="text-[20px] font-semibold font-noto-sans mb-4 text-white relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-out hover:after:w-full block"
                        >
                          {section.title}
                        </LocalizedClientLink>
                      ) : (
                        <h3 className="text-[20px] font-semibold font-noto-sans mb-4 text-white">
                          {section.title}
                        </h3>
                      )
                    })()}
                    {section.title === "Στοιχεία Επικοινωνίας" ? (
                      <div className="space-y-2 text-[16px] text-gray-300">
                        {links.map((link) => {
                          const linkUrl = normalizeUrl(link.url)
                          const isClickable = link.url && link.url.trim() !== ""

                          return (
                            <div
                              key={link.id}
                              className="flex items-start gap-2"
                            >
                              {isClickable ? (
                                <LocalizedClientLink
                                  href={linkUrl}
                                  className="text-white font-noto-sans hover:font-bold"
                                >
                                  {link.label}
                                </LocalizedClientLink>
                              ) : (
                                <span className="text-white font-noto-sans">
                                  {link.label}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <ul className="space-y-2 text-[16px] text-white font-noto-sans">
                        {links.map((link) => {
                          const linkUrl = normalizeUrl(link.url)
                          const isClickable = link.url && link.url.trim() !== ""

                          return (
                            <li key={link.id}>
                              {isClickable ? (
                                <LocalizedClientLink
                                  href={linkUrl}
                                  className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-out hover:after:w-full"
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
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-tertiary">
        <div className="max-w-[1350px] mx-auto px-2 sm:px-6 lg:px-2 py-2">
          <div className="text-[15px] text-secondary font-bold font-noto-sans leading-relaxed text-center">
            <ContentBlockRenderer blocks={[topbarText]} />
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-700">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-sm text-title-color text-center lg:text-left">
              {t("footer.copyright", { year: currentYear })}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-sm text-title-color text-center lg:text-left">
                {t("footer.developedBy")}{" "}
                <a
                  href="https://synergic.gr"
                  target="_blank"
                  className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-out hover:after:w-full"
                >
                  Synergic Software
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
