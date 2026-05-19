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
    <div className="w-full bg-[#1a1a1a] text-white">
      <div className="max-w-[1350px] mx-auto px-6 py-1 flex items-center justify-between">
        {/* Left side - Phone and Social Media Icons */}
        <div className="flex items-center gap-4 text-[13px] text-white">
          {/* Phone */}
          <a href="tel:2410232019" className="flex items-center gap-2 hover:text-white/80 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14.425 14.425" fill="currentColor">
              <path d="M13.062,12.254l-.365.384s-.868.913-3.236-1.58-1.5-3.407-1.5-3.407l.23-.242a1.792,1.792,0,0,0,.126-2.252L7.306,3.729a1.605,1.605,0,0,0-2.494-.241L3.554,4.812A1.849,1.849,0,0,0,3,6.178c.072,1.346.647,4.242,3.857,7.621,3.4,3.583,6.6,3.725,7.9,3.6a1.715,1.715,0,0,0,1.062-.568l1.138-1.2a1.8,1.8,0,0,0-.431-2.762L15,11.985A1.566,1.566,0,0,0,13.062,12.254Z" transform="translate(-3 -3)"/>
            </svg>
            <span>2410232019</span>
          </a>

          {/* Social Media Icons */}
          <div className="flex items-center gap-3 ml-2">
            {/* Facebook */}
            <a href="#" className="hover:text-white/80 transition-colors" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="hover:text-white/80 transition-colors" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" className="hover:text-white/80 transition-colors" aria-label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="hover:text-white/80 transition-colors" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right side - Language Selector */}
        <div className="flex items-center">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-[13px] text-white hover:text-white/80 transition-colors border border-white/30 rounded px-3 py-1"
            >
              <span>ΕΛΛΗΝΙΚΑ</span>
              <ChevronDown size={14} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded border z-50 min-w-[120px]">
                <button className="block w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100">English</button>
                <button className="block w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100">Ελληνικά</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderTopBar
