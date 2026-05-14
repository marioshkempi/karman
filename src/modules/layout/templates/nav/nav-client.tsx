"use client"

import { useEffect, useState } from "react"
import { Heart, Search, Menu, X, Repeat, ShoppingCart } from "lucide-react"
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

  // Navigation items for the main menu
  const navItems = [
    { label: "Κατηγορίες προϊόντων", href: "/categories", hasIcon: true },
    { label: "Δημοφιλή προϊόντα", href: "/best-selling" },
    { label: "Σχετικά με μας", href: "/about" },
    { label: "Επικοινωνία", href: "/contact-us" },
  ]

  return (
    <>
      <div className="relative">
        {/* Main Navigation Bar - Blue Background */}
        <nav className="bg-navblue">
          <div className="max-w-[1350px] mx-auto px-4 lg:px-6">
            {/* Mobile Top Bar */}
            <div className="flex lg:hidden items-center justify-between h-16">
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
                  <Logo
                    width={35}
                    height={35}
                    src={headerLogo}
                    classNameImage={"w-[120px] brightness-0 invert"}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between h-[70px]">
              {/* Logo */}
              <div className="flex-shrink-0">
                <LocalizedClientLink href="/">
                  <Logo 
                    width={50} 
                    height={50} 
                    src={headerLogo} 
                    classNameImage="brightness-0 invert"
                  />
                </LocalizedClientLink>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                {navItems.map((item, index) => (
                  <LocalizedClientLink
                    key={index}
                    href={item.href}
                    className="flex items-center gap-1.5 text-white text-[14px] font-medium hover:text-white/80 transition-colors whitespace-nowrap"
                  >
                    {item.hasIcon && (
                      <Menu size={16} />
                    )}
                    {item.label}
                  </LocalizedClientLink>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-[320px] mx-4">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Αναζήτηση με κωδικό ή λέξη κλειδί"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setOpen(true)}
                    className="w-full h-[38px] pl-10 pr-4 bg-white rounded-md text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-3">
                {/* Wishlist */}
                <LocalizedClientLink
                  href="/account/wishlist"
                  className="relative flex items-center p-2 text-white hover:text-white/80 transition-opacity"
                >
                  <Heart size={24} />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-bold leading-none">
                    {wishlistCount}
                  </span>
                </LocalizedClientLink>

                {/* Cart */}
                <LocalizedClientLink
                  href="/cart"
                  className="relative flex items-center p-2 text-white hover:text-white/80 transition-opacity"
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-bold leading-none">
                    {cartItemsCount}
                  </span>
                </LocalizedClientLink>
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
        <div className="relative lg:hidden py-3 px-4 bg-navblue">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Αναζήτηση με κωδικό ή λέξη κλειδί"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setOpen(true)}
              className="w-full h-[40px] pl-10 pr-4 bg-white rounded-md text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
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
