"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, X, Menu, Package } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface CategoryChild {
  id: string
  name?: string
  title?: string
  handle: string
  rank?: number
  children?: CategoryChild[]
}

interface MegaMenuItem {
  id: string
  title: string
  handle: string
  link?: string
  sort_order: number
  type: string
  category_id: string
  category_children?: CategoryChild[]
  children?: MegaMenuItem[]
}

interface MegaMenuCategory {
  id: string
  title: string
  handle: string
  type: string
  category_id: string
  items: MegaMenuItem[]
  category_children?: CategoryChild[]
}

interface MegaMenuProps {
  megaMenus?: MegaMenuCategory[]
  isMobileMenuOpen: boolean
  onMobileMenuToggle: (open: boolean) => void
  isInline?: boolean
  staticNavItems?: { label: string; href: string }[]
}

// All handles are pre-rewritten by the backend, so just prefix with /
const toHref = (handle: string) => `/${handle}`

export default function MegaMenu({
  megaMenus = [],
  isMobileMenuOpen,
  onMobileMenuToggle,
  isInline = false,
  staticNavItems = [],
}: MegaMenuProps) {
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  const activeMenuObject = megaMenus.find((m) => m.id === activeMenu)

  useEffect(() => {
    onMobileMenuToggle(false)
    setSelectedCategory(null)
    setActiveMenu(null)
    setIsCategoriesOpen(false)
  }, [pathname])

  const closeMobileMenu = () => {
    onMobileMenuToggle(false)
    setSelectedCategory(null)
  }

  const getMenuItemsForCategory = (categoryId: string) =>
    megaMenus.find((m) => m.id === categoryId)?.items?.filter(Boolean) || []

  const hasChildren = (categoryId: string) =>
    getMenuItemsForCategory(categoryId).length > 0

  // If inline mode (desktop), render just the nav items inline
  if (isInline) {
    return (
      <div 
        className="flex items-center gap-1"
        onMouseLeave={() => setIsCategoriesOpen(false)}
      >
        {/* Categories Dropdown Trigger */}
        <div 
          className="relative"
          onMouseEnter={() => setIsCategoriesOpen(true)}
        >
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-[14px] font-medium transition-colors duration-200
              ${isCategoriesOpen 
                ? "bg-orange text-white" 
                : "bg-transparent text-white hover:bg-orange hover:text-white"
              }`}
          >
            <Menu size={18} />
            <span>Κατηγορίες προϊόντων</span>
          </button>

          {/* Vertical Dropdown Menu */}
          <div
            className={`absolute top-full left-0 w-[320px] bg-white shadow-lg rounded-b-lg border border-gray-200 border-t-0 z-50
              transition-all duration-200 ease-out
              ${isCategoriesOpen 
                ? "opacity-100 translate-y-0 pointer-events-auto" 
                : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
          >
            <div className="py-2">
              {megaMenus.map((megaMenu) => (
                <LocalizedClientLink
                  key={megaMenu.id}
                  href={toHref(megaMenu.handle)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  {/* Icon placeholder - using Package icon as default */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
                    <Package size={20} className="text-gray-500" />
                  </div>
                  
                  {/* Category name */}
                  <span className="flex-1 text-[14px] text-gray-800 font-medium">
                    {megaMenu.title}
                  </span>
                  
                  {/* Right chevron */}
                  <ChevronRight size={18} className="text-gray-400" />
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </div>

        {/* Static Navigation Items */}
        {staticNavItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="px-3 py-2 text-[14px] text-white hover:text-white/80 transition-colors whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </div>
    )
  }

  // Mobile-only rendering (non-inline mode)
  return (
    <>
      {/* Mobile Menu Panel - Opens from LEFT, full screen */}
      <div
        className={`
          fixed inset-0 w-screen h-screen z-[101] bg-white overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {!selectedCategory ? (
          <div className="flex flex-col h-full">
            {/* Top Row - 57px height with blue gradient */}
            <div 
              className="h-[57px] flex items-center justify-between px-4 flex-shrink-0"
              style={{ background: "linear-gradient(90deg, #283B82 0%, #007BFF 50%, #283B82 100%)" }}
            >
              {/* Language Selector */}
              <button className="flex items-center gap-1 text-[14px] text-white">
                <span>Ελληνικά</span>
                <ChevronRight size={16} className="rotate-90 text-white/70" />
              </button>
              
              {/* Close Button */}
              <button 
                onClick={closeMobileMenu} 
                className="flex items-center gap-2 text-[14px] text-white"
              >
                <span>Κλείσιμο</span>
                <X size={20} />
              </button>
            </div>

            {/* Category List - 57px per row */}
            <div className="flex-1 overflow-auto">
              {megaMenus.map((megaMenu) => (
                <div
                  key={megaMenu.id}
                  className="h-[57px] flex items-center border-b border-[#E5E7EB] bg-white"
                >
                  <LocalizedClientLink
                    href={toHref(megaMenu.handle)}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 flex-1 h-full px-4"
                  >
                    {/* Category Icon Placeholder */}
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Package size={24} className="text-gray-600" />
                    </div>
                    <span className="text-[15px] text-gray-800">
                      {megaMenu.title}
                    </span>
                  </LocalizedClientLink>

                  {hasChildren(megaMenu.id) && (
                    <button
                      onClick={() => setSelectedCategory(megaMenu.id)}
                      className="h-full px-4 border-l border-[#E5E7EB]"
                    >
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                  )}
                </div>
              ))}

              {/* Secondary Action Rows - 69px height, #F1F5F9 background */}
              <div className="bg-[#F1F5F9]">
                {/* Account Login */}
                <LocalizedClientLink
                  href="/account"
                  onClick={closeMobileMenu}
                  className="h-[69px] flex items-center gap-3 px-4 border-b border-[#E5E7EB]"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E3A5F]">
                    <Package size={20} className="text-white" />
                  </div>
                  <span className="text-[15px] text-gray-800">Σύνδεση Λογαριασμού</span>
                </LocalizedClientLink>

                {/* Compare */}
                <LocalizedClientLink
                  href="/compare"
                  onClick={closeMobileMenu}
                  className="h-[69px] flex items-center gap-3 px-4 border-b border-[#E5E7EB]"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E3A5F]">
                    <Package size={20} className="text-white" />
                  </div>
                  <span className="text-[15px] text-gray-800">Σύγκριση ( 0 )</span>
                </LocalizedClientLink>

                {/* Cart */}
                <LocalizedClientLink
                  href="/cart"
                  onClick={closeMobileMenu}
                  className="h-[69px] flex items-center gap-3 px-4"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E3A5F]">
                    <Package size={20} className="text-white" />
                  </div>
                  <span className="text-[15px] text-gray-800">Το καλάθι μου ( 0 )</span>
                </LocalizedClientLink>
              </div>
            </div>

            {/* Bottom Info Block - Blue gradient background */}
            <div 
              className="py-6 px-5 flex-shrink-0"
              style={{ background: "linear-gradient(90deg, #283B82 0%, #007BFF 50%, #283B82 100%)" }}
            >
              {/* Address */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <span className="text-white text-[14px] leading-tight">
                  Ειρήνης 31 Εύοσμος<br/>Θεσσαλονίκη 56226
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 6-10 7L2 6"/>
                  </svg>
                </div>
                <span className="text-white text-[14px]">info@karman.com</span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span className="text-white text-[14px]">
                  2311263836, 6936800257,<br/>6930571431
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Subcategory View */
          <div className="flex flex-col h-full">
            <div 
              className="h-[57px] flex items-center justify-between px-4 flex-shrink-0"
              style={{ background: "linear-gradient(90deg, #283B82 0%, #007BFF 50%, #283B82 100%)" }}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="text-white text-[16px] font-medium">
                  {megaMenus.find((m) => m.id === selectedCategory)?.title}
                </span>
              </div>
              <button onClick={closeMobileMenu} className="text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 bg-white overflow-auto">
              {getMenuItemsForCategory(selectedCategory).map((item) => (
                <div
                  key={item.id}
                  className="h-[57px] flex items-center border-b border-[#E5E7EB]"
                >
                  <LocalizedClientLink
                    href={toHref(item.handle)}
                    onClick={closeMobileMenu}
                    className="flex-1 h-full flex items-center px-6 text-[15px] text-gray-800"
                  >
                    {item.title}
                  </LocalizedClientLink>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
