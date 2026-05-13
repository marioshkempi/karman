"use client"
import { useEffect, useState, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import { ChevronDown } from "lucide-react"
import Spinner from "@modules/common/icons/spinner"
import { useRouter, usePathname } from "@i18n/routing"
import { useLocale } from "next-intl"
import { setCookie } from "@lib/util/cookies"
import { MEDUSA_LOCALE_COOKIE } from "@constants/global"
import { listLocales } from "@lib/data/locales"

export default function LangSwitcher() {
  const [loading, setLoading] = useState(true)
  const [locales, setLocales] = useState<HttpTypes.StoreLocale[]>([])
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const languageRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  useEffect(() => {
    if (!loading) {
      return
    }

    listLocales().then(({ locales: dataLocales }) => {
      setLocales(dataLocales)
      setLoading(false)
    })
  }, [loading])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLocaleChange = (locale: HttpTypes.StoreLocale) => {
    const shortCode = locale.code.split("-")[0].toLowerCase()
    const fullCode = locale.code

    setIsLanguageOpen(false)
    setCookie(MEDUSA_LOCALE_COOKIE, fullCode, 365)
    router.replace({ pathname }, { locale: shortCode })
  }

  const getShortCode = (code: string) => {
    return code.split("-")[0].toUpperCase()
  }

  const getDisplayCode = () => {
    return currentLocale.toUpperCase()
  }

  if (loading) {
    return <Spinner />
  }

  if (locales.length === 0) {
    return null
  }

  return (
    <div className="relative px-4" ref={languageRef}>
      <button
        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        className="flex items-center gap-1 text-inherit  transition-colors"
        aria-label="Change language"
      >
        <span className="text-[14px] font-bold">{getDisplayCode()}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isLanguageOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isLanguageOpen && (
        <div className="absolute right-0 mt-2 w-20 bg-white shadow-lg rounded border border-grey-20 z-50">
          {locales.map((locale) => {
            const shortCode = locale.code.split("-")[0]
            const isCurrentLocale =
              shortCode.toLowerCase() === currentLocale.toLowerCase()

            return (
              <button
                key={locale.code}
                onClick={() => handleLocaleChange(locale)}
                className={`w-full px-3 py-2 text-xs text-left hover:bg-grey-10 text-black transition-colors first:rounded-t last:rounded-b ${
                  isCurrentLocale ? "bg-grey-5 font-medium" : ""
                }`}
              >
                {getShortCode(locale.code)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}