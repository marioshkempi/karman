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
      {/* Mobile Menu Overlay */}
      <div
        onClick={closeMobileMenu}
        className={`
          fixed inset-0 z-[100] bg-black
          transition-opacity duration-300
          ${
            isMobileMenuOpen
              ? "opacity-50 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`
          fixed inset-y-0 left-0 w-full z-[101] bg-white shadow-2xl overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {!selectedCategory ? (
          <div className="flex flex-col h-full">
            <div className="bg-primary flex items-center justify-end px-4 py-4">
              <button onClick={closeMobileMenu} className="text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-tertiary">
              {megaMenus.map((megaMenu) => (
                <div
                  key={megaMenu.id}
                  className={`flex items-center ${
                    hasChildren(megaMenu.id)
                      ? "bg-white border-b border-gray-200"
                      : "bg-tertiary"
                  }`}
                >
                  <LocalizedClientLink
                    href={toHref(megaMenu.handle)}
                    onClick={closeMobileMenu}
                    className="flex-1 px-6 py-4 text-secondary text-[15px]"
                  >
                    {megaMenu.title}
                  </LocalizedClientLink>

                  {hasChildren(megaMenu.id) && (
                    <button
                      onClick={() => setSelectedCategory(megaMenu.id)}
                      className="px-4 py-4 border-l border-gray-200"
                    >
                      <ChevronRight size={25} className="text-primary" />
                    </button>
                  )}
                </div>
              ))}

              {/* Static nav items in mobile */}
              {staticNavItems.map((item, index) => (
                <div
                  key={`static-${index}`}
                  className="flex items-center bg-white border-b border-gray-200"
                >
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex-1 px-6 py-4 text-secondary text-[15px]"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="bg-secondary flex items-center justify-between px-4 py-4">
              <div className={"align-middle flex items-center gap-2"}>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-white"
                >
                  <ChevronLeft size={25} />
                </button>

                <span className="text-white text-[16px] font-medium flex-1 text-center">
                  {megaMenus.find((m) => m.id === selectedCategory)?.title}
                </span>
              </div>
              <button onClick={closeMobileMenu} className="text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 bg-white">
              {getMenuItemsForCategory(selectedCategory).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border-b border-gray-200"
                >
                  <LocalizedClientLink
                    href={toHref(item.handle)}
                    onClick={closeMobileMenu}
                    className="flex-1 px-6 py-4 text-secondary text-[15px]"
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
