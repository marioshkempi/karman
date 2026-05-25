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

// KARMAN static footer data
const KARMAN_CONTACT = {
  address: "Ειρήνης 31 Εύοσμος\nΘεσσαλονίκη 56226",
  email: "info@karman.com",
  phones: "2311263836, 6936800257,\n6930571431",
}

const KARMAN_CATEGORIES = [
  { label: "Εξωτερικό αυτοκινήτου", href: "/exoteriko-aftokinitou" },
  { label: "Εσωτερικό αυτοκινήτου", href: "/esoteriko-aftokinitou" },
  { label: "Καθαρισμός περιποίηση", href: "/katharismos-peripoiisi" },
  { label: "Εργαλεία", href: "/ergaleia" },
  { label: "Ηλεκτρολογικά", href: "/ilektrologika" },
  { label: "Moto", href: "/moto" },
  { label: "Διάφορα", href: "/diafora" },
]

const KARMAN_INFO = [
  { label: "Τρόποι παράδοσης", href: "/tropoi-paradosis" },
  { label: "Όροι χρήσης", href: "/oroi-xrisis" },
  { label: "Σχετικά με εμάς", href: "/sxetika-me-emas" },
  { label: "Επιστροφές προϊόντων", href: "/epistrofes-proionton" },
  { label: "Τρόποι πληρωμής", href: "/tropoi-pliromis" },
  { label: "Προσωπικά δεδομένα", href: "/prosopika-dedomena" },
]

const SOCIAL_LINKS = [
  { icon: "/images/socials/x-black.png", href: "https://x.com/biokifisia?lang=el", alt: "X" },
  { icon: "/images/socials/facebook-black.png", href: "https://www.facebook.com/bio.kifisia", alt: "Facebook" },
  { icon: "/images/socials/instagram-black.png", href: "https://www.instagram.com/biokifisia_eshop/?hl=el", alt: "Instagram" },
]

export default async function Footer({ topbarText }: any) {
  const t = await getTranslations()
  const { sections } = await listFooterSections()
  const currentYear = new Date().getFullYear()
  const hasDynamicData = sections && sections.length > 0
  const footerLogo: any = await getSiteSetting("footer_logo")

  // Always render KARMAN-style footer
  return (
    <footer 
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: "url('/images/footer-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Blue overlay for readability - reduced opacity to show background image */}
      <div className="absolute inset-0 bg-[#112F82]/50" />
      
      <div className="relative z-10 max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Mobile accordion */}
        <div className="lg:hidden space-y-6">
          <div className="flex items-center mb-6">
            <LocalizedClientLink href="/">
              <Image
                src="/images/karman-footer-logo.png"
                width={160}
                height={64}
                alt="KARMAN logo"
                className="h-auto w-[160px]"
              />
            </LocalizedClientLink>
          </div>
          
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Αξιόπιστα ανταλλακτικά που εγγυώνται την κορυφαία απόδοση και την ασφάλεια του αυτοκινήτου σας.
          </p>
          
          {/* Social icons mobile */}
          <div className="flex items-center gap-4 mb-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.alt}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src={social.icon}
                  width={20}
                  height={20}
                  alt={social.alt}
                  className="w-5 h-5"
                />
              </a>
            ))}
          </div>

          {/* Payment icons mobile */}
          <div className="mb-6">
            <Image
              src="/images/payment-cards.png"
              width={160}
              height={28}
              alt="Payment methods: Mastercard, VISA, PayPal, Skrill"
              className="h-auto"
            />
          </div>

          <div className="space-y-2">
            <FooterAccordionItem title="Επικοινωνία">
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="whitespace-pre-line">{KARMAN_CONTACT.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${KARMAN_CONTACT.email}`} className="hover:text-white transition-colors">
                    {KARMAN_CONTACT.email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="whitespace-pre-line">{KARMAN_CONTACT.phones}</span>
                </div>
              </div>
            </FooterAccordionItem>

            <FooterAccordionItem title="Κατηγορίες">
              <ul className="space-y-2 text-sm text-white/80">
                {KARMAN_CATEGORIES.map((cat) => (
                  <li key={cat.href}>
                    <LocalizedClientLink href={cat.href} className="hover:text-white transition-colors">
                      {cat.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </FooterAccordionItem>

            <FooterAccordionItem title="Πληροφορίες">
              <ul className="space-y-2 text-sm text-white/80">
                {KARMAN_INFO.map((info) => (
                  <li key={info.href}>
                    <LocalizedClientLink href={info.href} className="hover:text-white transition-colors">
                      {info.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </FooterAccordionItem>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-12">
          {/* Column 1: Logo + description + socials + payment */}
          <div className="space-y-6">
            <LocalizedClientLink href="/">
              <Image
                src="/images/karman-footer-logo.png"
                width={200}
                height={80}
                alt="KARMAN logo"
                className="h-auto"
              />
            </LocalizedClientLink>
            
            <p className="text-white/70 text-sm leading-relaxed">
              Αξιόπιστα ανταλλακτικά που εγγυώνται την κορυφαία απόδοση και την ασφάλεια του αυτοκινήτου σας.
            </p>
            
            {/* Social icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.alt}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={social.icon}
                    width={20}
                    height={20}
                    alt={social.alt}
                    className="w-5 h-5"
                  />
                </a>
              ))}
            </div>

            {/* Payment icons */}
            <Image
              src="/images/payment-cards.png"
              width={180}
              height={32}
              alt="Payment methods: Mastercard, VISA, PayPal, Skrill"
              className="h-auto"
            />
          </div>

          {/* Column 2: Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Επικοινωνία</h3>
            <div className="space-y-4 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="whitespace-pre-line">{KARMAN_CONTACT.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${KARMAN_CONTACT.email}`} className="hover:text-white transition-colors">
                  {KARMAN_CONTACT.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="whitespace-pre-line">{KARMAN_CONTACT.phones}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Κατηγορίες</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {KARMAN_CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <LocalizedClientLink href={cat.href} className="hover:text-white transition-colors">
                    {cat.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Πληροφορίες</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {KARMAN_INFO.map((info) => (
                <li key={info.href}>
                  <LocalizedClientLink href={info.href} className="hover:text-white transition-colors">
                    {info.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-white/60">
            <p>© {currentYear}, All Rights Reserved</p>
            <p>
              Developed by{" "}
              <a
                href="https://synergic.gr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Synergic Software
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
