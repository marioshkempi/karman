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
    <div className="w-full bg-[#F5F5F5] border-b border-gray-200 py-2">
      <div className="max-w-[1350px] mx-auto px-4 flex items-center justify-between">
        {/* Left side - Phone and Email */}
        <div className="flex items-center gap-6 text-[13px] text-secondary">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-navblue" />
            <span>2311263836</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-navblue" />
            <span>info@karman.com</span>
          </div>
        </div>

        {/* Right side - Login and Language */}
        <div className="flex items-center gap-6">
          {/* Login */}
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-2 text-[13px] text-secondary hover:text-primary transition-colors"
          >
            <User size={14} />
            <span>Σύνδεση</span>
          </LocalizedClientLink>

          {/* Dropdown separator */}
          <ChevronDown size={14} className="text-gray-400" />

          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-[13px] text-secondary hover:text-primary transition-colors"
            >
              <span>EN</span>
              <ChevronDown size={14} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded border z-50 min-w-[100px]">
                <button className="block w-full px-3 py-2 text-left text-sm text-secondary hover:bg-gray-100">English</button>
                <button className="block w-full px-3 py-2 text-left text-sm text-secondary hover:bg-gray-100">Ελληνικά</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderTopBar
