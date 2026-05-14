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

  // Navigation items for the sub-menu
  const subNavItems = [
    { label: "Κατηγορίες προϊόντων", href: "/categories", hasIcon: true },
    { label: "Δημοφιλή προϊόντα", href: "/best-selling" },
    { label: "Σχετικά με μας", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Επικοινωνία", href: "/contact-us" },
  ]

  return (
    <>
      <div className="relative">
        {/* Tier 2: White Main Header Row */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1350px] mx-auto px-4 lg:px-6">
            {/* Mobile Top Bar */}
            <div className="flex lg:hidden items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-secondary hover:text-primary bg-transparent border-none shadow-none"
                >
                  {isMobileMenuOpen ? (
                    <X size={28} />
                  ) : (
                    <Menu size={28} className="text-secondary" />
                  )}
                </Button>
                <LocalizedClientLink href="/">
                  <Logo
                    width={35}
                    height={35}
                    src={headerLogo}
                    classNameImage={"w-[100px]"}
                  />
                </LocalizedClientLink>
              </div>

              <div className="flex items-center gap-2">
                <LocalizedClientLink
                  href="/account/wishlist"
                  className="relative flex items-center p-2 text-secondary hover:text-primary"
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
                  className="relative flex items-center p-2 text-secondary hover:text-primary"
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

            {/* Desktop Main Header */}
            <div className="hidden lg:flex items-center justify-between h-[60px]">
              {/* Left Group: Logo + My Garage */}
              <div className="flex items-center gap-4">
                <LocalizedClientLink href="/">
                  <Logo 
                    width={50} 
                    height={50} 
                    src={headerLogo} 
                    classNameImage="w-[120px]"
                  />
                </LocalizedClientLink>

                {/* My Garage Button */}
                <LocalizedClientLink
                  href="/my-garage"
                  className="flex items-center gap-2 bg-navblue text-white px-4 py-2 rounded text-[13px] font-medium hover:bg-primary2 transition-colors"
                >
                  <Car size={18} />
                  <span>My Garage</span>
                </LocalizedClientLink>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-[400px] mx-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Αναζήτηση με κωδικό ή λέξη κλειδί"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setOpen(true)}
                    className="w-full h-[40px] pl-4 pr-12 bg-gray-100 border border-gray-200 rounded text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-500 hover:text-primary">
                    <Search size={18} />
                  </button>
                </div>
              </div>

              {/* Right Group: Account, Wishlist, Cart */}
              <div className="flex items-center gap-4">
                {/* Account */}
                <LocalizedClientLink
                  href="/account"
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-navblue flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="text-[12px] leading-tight">
                    <span className="text-gray-500">Σύνδεση</span>
                    <br />
                    <span className="font-medium text-secondary">Λογαριασμού</span>
                  </div>
                </LocalizedClientLink>

                {/* Wishlist with arrows */}
                <div className="flex items-center gap-1">
                  <button className="p-1 text-gray-400 hover:text-primary">
                    <ChevronLeft size={14} />
                  </button>
                  <LocalizedClientLink
                    href="/account/wishlist"
                    className="relative flex items-center text-secondary hover:text-primary transition-colors"
                  >
                    <Heart size={24} />
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-bold leading-none">
                      {wishlistCount}
                    </span>
                  </LocalizedClientLink>
                  <button className="p-1 text-gray-400 hover:text-primary">
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Cart */}
                <LocalizedClientLink
                  href="/cart"
                  className="relative flex items-center text-secondary hover:text-primary transition-colors"
                >
                  <ShoppingCart size={26} />
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-0.5 flex items-center justify-center rounded-full bg-orange text-white text-[10px] font-bold leading-none">
                    {cartItemsCount}
                  </span>
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 3: White Sub-Menu Row */}
        <div className="hidden lg:block bg-white border-b border-gray-200">
          <div className="max-w-[1350px] mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-[44px]">
              {/* Left: Sub-menu items */}
              <div className="flex items-center gap-1">
                {subNavItems.map((item, index) => (
                  <LocalizedClientLink
                    key={index}
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-2 text-secondary text-[14px] hover:text-primary transition-colors"
                  >
                    {item.hasIcon && (
                      <Menu size={16} className="text-secondary" />
                    )}
                    {item.label}
                  </LocalizedClientLink>
                ))}
              </div>

              {/* Right: Best Seller Sale tag */}
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-secondary">Best Seller</span>
                <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">Sale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 4: Faint Grey Promo Text Row */}
        <div className="hidden lg:block bg-gray-50 border-b border-gray-100">
          <div className="max-w-[1350px] mx-auto px-4 lg:px-6">
            <div className="flex items-center h-[32px] overflow-hidden">
              <div className="flex items-center gap-4 text-[12px] text-gray-500 whitespace-nowrap">
                <span>FREE + ΔΩΡΕΑΝ Μεταφορικά για 1-3 συνεχόμενες παραγγελίες.</span>
                <span className="text-gray-300">|</span>
                <span>Κερδίστε 10€ για αγορές άνω των 100€</span>
                <span className="text-gray-300">|</span>
                <span>Αγοράστε το σετ Δισκόφρενα + Τακάκια και κερδίστε -15% στο σύνολο + ΔΩΡΟ ένα κιτ...</span>
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
        <div className="relative lg:hidden py-3 px-4 bg-white border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Αναζήτηση με κωδικό ή λέξη κλειδί"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setOpen(true)}
              className="w-full h-[40px] pl-4 pr-12 bg-gray-100 border border-gray-200 rounded text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-primary"
            />
            <button className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-500">
              <Search size={18} />
            </button>
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
