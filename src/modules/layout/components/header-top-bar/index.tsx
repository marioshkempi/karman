"use client"

import { useState } from "react"
import { Phone, Mail, User, ChevronDown } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"

const HeaderTopBar = ({ topbarText }: any) => {
  const t = useTranslations()
  const [isVisible, setIsVisible] = useState(true)
  const [langOpen, setLangOpen] = useState(false)

  if (!isVisible) return null

  return (
    <div className="w-full bg-[#F5F5F5] text-secondary py-2.5 border-b border-gray-200">
      <div className="max-w-[1350px] mx-auto px-4 flex items-center justify-between">
        {/* Left side - Phone and Email */}
        <div className="flex items-center gap-6">
          <a 
            href="tel:2311263836" 
            className="flex items-center gap-2 text-[14px] text-secondary hover:text-primary transition-colors"
          >
            <Phone size={16} className="text-primary" />
            <span>2311263836</span>
          </a>
          <a 
            href="mailto:info@karman.com" 
            className="hidden md:flex items-center gap-2 text-[14px] text-secondary hover:text-primary transition-colors"
          >
            <Mail size={16} className="text-primary" />
            <span>info@karman.com</span>
          </a>
        </div>

        {/* Right side - Login and Language */}
        <div className="flex items-center gap-4">
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-2 text-[14px] text-secondary hover:text-primary transition-colors"
          >
            <User size={16} className="text-primary" />
            <span className="hidden md:inline">{t("header.login") || "Σύνδεση"}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </LocalizedClientLink>

          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-[14px] text-secondary hover:text-primary transition-colors"
            >
              <span>EN</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded border z-50 min-w-[60px]">
                <button className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100">EN</button>
                <button className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100">EL</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderTopBar
