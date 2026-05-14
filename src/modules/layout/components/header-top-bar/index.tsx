"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"

const HeaderTopBar = ({ topbarText }: any) => {
  const t = useTranslations()
  const [isVisible, setIsVisible] = useState(true)
  const [langOpen, setLangOpen] = useState(false)

  if (!isVisible) return null

  return (
    <div className="w-full bg-navblue text-white py-2">
      <div className="max-w-[1350px] mx-auto px-4 flex items-center justify-between">
        {/* Left side - Navigation Links */}
        <div className="flex items-center gap-4 text-[13px]">
          <LocalizedClientLink
            href="/about"
            className="text-white hover:text-white/80 transition-colors"
          >
            About Us
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/faq"
            className="text-white hover:text-white/80 transition-colors"
          >
            FAQ
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/track-order"
            className="text-white hover:text-white/80 transition-colors"
          >
            Παρακολούθηση παραγγελίας
          </LocalizedClientLink>
        </div>

        {/* Right side - Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 text-[13px] text-white hover:text-white/80 transition-colors"
          >
            <span>Ελληνικά</span>
            <ChevronDown size={14} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded border z-50 min-w-[100px]">
              <button className="block w-full px-3 py-2 text-left text-sm text-secondary hover:bg-gray-100">Ελληνικά</button>
              <button className="block w-full px-3 py-2 text-left text-sm text-secondary hover:bg-gray-100">English</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeaderTopBar
