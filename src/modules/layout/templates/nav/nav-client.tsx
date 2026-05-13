"use client"

import { useEffect, useState } from "react"
import { Heart, Search, Menu, X, Repeat } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Logo from "./logo"
import CartButtonClient from "@modules/layout/components/cart-button-client"
import { useCompareStore } from "global-states/use-compare"
import { CompareModal } from "@modules/products/components/compare-modal"
import { Button } from "@medusajs/ui"
import { useSearchParams } from "next/navigation"
import { SearchDropdown } from "@modules/search/dropdown/SearchDropdown"
import LoginPromptModal from "@modules/layout/components/login-prompt-modal"
import AccountMenu from "@modules/layout/components/user-account-widget/account-header-widget"
import MegaMenu from "@modules/layout/components/mega-menu/MegaMenu"

interface NavbarProp {
  regions?: HttpTypes.StoreRegion[] | null
  cart?: HttpTypes.StoreCart | null
  wishlistCount: number
  headerLogo: string
  customer?: HttpTypes.StoreCustomer | null
  menu?: {
    megaMenus: Array<{
      id: string
      title: string
      handle: string
      type: string
      category_id: string
      items: Array<{
        id: string
        title: string
        link: string
        sort_order: number
        type: string
        category_id: string
        children?: Array<{
          id: string
          title: string
          link: string
          sort_order: number
          type: string
          category_id: string
        }>
      }>
    }>
  }
}

export default function NavbarClient({
  regions,
  cart,
  wishlistCount,
  menu,
  headerLogo,
  customer,
}: NavbarProp) {
  const searchParams = useSearchParams()
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const { getCompareCount } = useCompareStore()
  const [mounted, setMounted] = useState(false)
  const [compareCount, setCompareCount] = useState<number>(0)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>(null) //useState<any[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const s = searchParams.get("s")
    if (!s) {
      setQuery("")
      setResults([])
      setOpen(false)
    } else {
      setQuery(s)
      setOpen(false)
      setResults([])
    }
  }, [searchParams])

  useEffect(() => {
    setMounted(true)
    setCompareCount(getCompareCount())
  }, [getCompareCount])
  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    const timeout = setTimeout(async () => {
      const params = new URLSearchParams({ q: query })
      const res = await fetch(`/api/search?${params.toString()}`)
      const data = await res.json()
      setResults(data)
      setOpen(true)
    }, 250)

    return () => clearTimeout(timeout)
  }, [query])

  return (
    <>
      <div className="relative">
        <nav className="bg-white mt-3">
          <div className="max-w-[1350px] mx-auto px-0 lg:px-8">
            {/* Mobile Top Bar */}
            <div className="flex lg:hidden items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 bg-transparent border-none shadow-none"
                >
                  {isMobileMenuOpen ? (
                    <X size={28} />
                  ) : (
                    <Menu size={40} className="text-menubg" />
                  )}
                </Button>
                <LocalizedClientLink href="/">
                  <Logo
                    width={35}
                    height={35}
                    src={headerLogo}
                    classNameImage={"w-[142px]"}
                  />
                </LocalizedClientLink>
              </div>

              <div className="flex items-center gap-3 lg:gap-2">
                <AccountMenu customer={customer} />
                <LocalizedClientLink
                  href="/account/wishlist"
                  className="relative flex items-center p-2 text-quinary hover:opacity-80"
                >
                  <Heart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-white text-[11px] font-semibold leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </LocalizedClientLink>
                <CartButtonClient cart={cart} />
              </div>
            </div>

            {/* Desktop Top Bar */}
            <div className="hidden lg:flex items-start justify-between h-20 gap-4">
              <div className="flex items-center flex-shrink-0">
                <LocalizedClientLink href="/">
                  <Logo width={50} height={50} src={headerLogo} />
                </LocalizedClientLink>
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ψάξε στον κατάλογό μας"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setOpen(true)}
                    className="w-[390px] h-[35px] pl-4 pr-12 border-2 border-primary rounded-[20.61px] text-sm placeholder:text-primary placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  />
                  <Search
                    size={20}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <AccountMenu customer={customer} />
                  <LocalizedClientLink
                    href="/account/wishlist"
                    className="flex items-center gap-1 p-2 text-quinary hover:opacity-80 transition-opacity duration-200"
                  >
                    <Heart size={22} />
                    <span className="text-[14px]">({wishlistCount})</span>
                  </LocalizedClientLink>
                  <button
                    onClick={() => setIsCompareOpen(true)}
                    className="flex items-center gap-1 p-2 text-quinary hover:opacity-80"
                  >
                    <Repeat size={20} />
                    <span className="text-[14px]">
                      ({mounted ? compareCount : 0})
                    </span>
                  </button>
                  <CartButtonClient cart={cart} />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <MegaMenu
          megaMenus={menu?.megaMenus}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={setIsMobileMenuOpen}
        />

        {isCompareOpen && (
          <CompareModal onClose={() => setIsCompareOpen(false)} />
        )}

        <LoginPromptModal
          isOpen={isLoginPromptOpen}
          onClose={() => setIsLoginPromptOpen(false)}
        />

        {/* Mobile Search */}
        <div className="relative lg:hidden py-2 mx-3 pb-3">
          <input
            type="text"
            placeholder="Ψάξε στον κατάλογό μας"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setOpen(true)}
            className="h-[35px] pl-4 pr-12 border-2 border-primary rounded-[20.61px] text-sm placeholder:text-primary placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 w-full"
          />
          <Search
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
          />
        </div>

        <SearchDropdown
          data={results}
          query={query}
          setQuery={setQuery}
          setOpen={setOpen}
          open={open}
        />
      </div>
    </>
  )
}
