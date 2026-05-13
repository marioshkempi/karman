"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, X } from "lucide-react"
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
}

// All handles are pre-rewritten by the backend, so just prefix with /
const toHref = (handle: string) => `/${handle}`

export default function MegaMenu({
  megaMenus = [],
  isMobileMenuOpen,
  onMobileMenuToggle,
}: MegaMenuProps) {
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const activeMenuObject = megaMenus.find((m) => m.id === activeMenu)

  useEffect(() => {
    onMobileMenuToggle(false)
    setSelectedCategory(null)
    setActiveMenu(null)
  }, [pathname])

  const closeMobileMenu = () => {
    onMobileMenuToggle(false)
    setSelectedCategory(null)
  }

  const getMenuItemsForCategory = (categoryId: string) =>
    megaMenus.find((m) => m.id === categoryId)?.items?.filter(Boolean) || []

  const hasChildren = (categoryId: string) =>
    getMenuItemsForCategory(categoryId).length > 0

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        onClick={closeMobileMenu}
        className={`
          lg:hidden fixed inset-0 z-[100] bg-black
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
          lg:hidden fixed inset-y-0 left-0 w-full z-[101] bg-white shadow-2xl overflow-y-auto
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
                      ? "bg-white  border-b border-gray-200"
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

      <div
        className="hidden lg:block bg-white mt-3 lg:sticky lg:top-0 lg:z-30"
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="bg-white border-b">
          <div className="max-w-[1350px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-evenly space-x-7 py-4">
              {megaMenus.map((megaMenu) => (
                <div
                  key={megaMenu.id}
                  className="relative m-0"
                  onMouseEnter={() => setActiveMenu(megaMenu.id)}
                >
                  <Link
                    href={toHref(megaMenu.handle)}
                    className={`relative inline-block whitespace-nowrap text-[14px] font-medium
                      transition-colors duration-200
                      after:absolute after:left-0 after:-bottom-[2px]
                      after:h-[1px] after:bg-current
                      after:transition-all after:duration-300 after:ease-out
                      ${
                        activeMenuObject === megaMenu
                          ? "text-primary after:w-full"
                          : "text-secondary after:w-0 hover:text-primary hover:after:w-full"
                      }
                    `}
                  >
                    {megaMenu.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`absolute left-0 right-0 bg-white shadow-lg z-[100] border-t
            transition-all duration-600 delay-600 ease-in-out
            ${
              activeMenuObject && activeMenuObject.items.length > 0
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-h-[70vh] overflow-y-auto">
            <div className="columns-5 gap-6 max-w-[1350px] self-center justify-self-center">
              {(activeMenuObject?.items ?? []).map((section) => (
                <div
                  key={section.id}
                  className="space-y-6 break-inside-avoid mb-6"
                >
                  <LocalizedClientLink
                    href={toHref(section.handle)}
                    className="relative inline-block text-[14px] font-bold text-secondary
                      transition-colors duration-200 hover:text-primary"
                  >
                    {section.title}
                  </LocalizedClientLink>

                  <ul className="space-y-1">
                    {section.children?.map((child) => (
                      <li key={child.id}>
                        <LocalizedClientLink
                          href={toHref(child.handle)}
                          className="relative inline-block text-secondary text-[14px]
                            transition-colors duration-200 hover:text-primary"
                        >
                          {child.title}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
