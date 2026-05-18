"use client"

import { useEffect, useState } from "react"
import { Heart, Search, Menu, X, ShoppingCart, User, ChevronLeft, ChevronRight, Car } from "lucide-react"
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
  const [results, setResults] = useState<any>(null)
  const [open, setOpen] = useState(false)

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

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

  // Navigation items for the main blue nav bar
  const mainNavItems = [
    { label: "Κατηγορίες προϊόντων", href: "/categories", hasIcon: true },
    { label: "Δημοφιλή προϊόντα", href: "/best-selling" },
    { label: "Σχετικά με μας", href: "/about" },
    { label: "Επικοινωνία", href: "/contact-us" },
  ]

  return (
    <>
      <div className="relative">
        {/* Main Blue Navigation Bar */}
        <div className="bg-navblue">
          <div className="max-w-[1350px] mx-auto px-4 lg:px-6">
            {/* Mobile Top Bar */}
            <div className="flex lg:hidden items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-white hover:text-white/80 bg-transparent border-none shadow-none"
                >
                  {isMobileMenuOpen ? (
                    <X size={28} />
                  ) : (
                    <Menu size={28} className="text-white" />
                  )}
                </Button>
                <LocalizedClientLink href="/">
                  <img 
                    src="/logo.png" 
                    alt="Karman Logo" 
                    className="h-8 w-auto"
                  />
                </LocalizedClientLink>
              </div>

              <div className="flex items-center gap-2">
                <LocalizedClientLink
                  href="/account/wishlist"
                  className="relative flex items-center p-2 text-white hover:text-white/80"
                >
                  <Heart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-semibold leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/cart"
                  className="relative flex items-center p-2 text-white hover:text-white/80"
                >
                  <ShoppingCart size={22} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-semibold leading-none">
                      {cartItemsCount}
                    </span>
                  )}
                </LocalizedClientLink>
              </div>
            </div>

            {/* Desktop Main Navigation */}
            <div className="hidden lg:flex items-center justify-between h-[56px]">
              {/* Left Group: Logo + Nav Items */}
              <div className="flex items-center gap-6">
                <LocalizedClientLink href="/">
                  <img 
                    src="/logo.png" 
                    alt="Karman Logo" 
                    className="h-8 w-auto"
                  />
                </LocalizedClientLink>

                {/* Navigation Items */}
                <nav className="flex items-center gap-1">
                  {mainNavItems.map((item, index) => (
                    <LocalizedClientLink
                      key={index}
                      href={item.href}
                      className="flex items-center gap-1.5 px-3 py-2 text-white text-[14px] hover:text-white/80 transition-colors"
                    >
                      {item.hasIcon && (
                        <Menu size={16} className="text-white" />
                      )}
                      {item.label}
                    </LocalizedClientLink>
                  ))}
                </nav>
              </div>

              {/* Right Group: Search Bar, Wishlist, Cart */}
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <div className="flex items-center bg-white/10 border border-white/30 rounded-md overflow-hidden">
                    <div className="flex items-center justify-center pl-3 text-white/70">
                      <Search size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Αναζήτηση με κωδικό ή λέξη κλειδί"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => query.trim() && setOpen(true)}
                      className="w-[220px] h-[36px] px-3 bg-transparent text-white text-[13px] placeholder:text-white/60 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Wishlist */}
                <LocalizedClientLink
                  href="/account/wishlist"
                  className="relative flex items-center text-white hover:text-white/80 transition-colors"
                >
                  <Heart size={22} />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-0.5 flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-bold leading-none">
                    {wishlistCount}
                  </span>
                </LocalizedClientLink>

                {/* Cart */}
                <LocalizedClientLink
                  href="/cart"
                  className="relative flex items-center text-white hover:text-white/80 transition-colors"
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-0.5 flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-bold leading-none">
                    {cartItemsCount}
                  </span>
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>

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
        <div className="relative lg:hidden py-3 px-4 bg-navblue border-b border-white/10">
          <div className="relative">
            <div className="flex items-center bg-white/10 border border-white/30 rounded-md overflow-hidden">
              <div className="flex items-center justify-center pl-3 text-white/70">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Αναζήτηση με κωδικό ή λέξη κλειδί"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim() && setOpen(true)}
                className="w-full h-[40px] px-3 bg-transparent text-white text-[13px] placeholder:text-white/60 focus:outline-none"
              />
            </div>
          </div>
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
