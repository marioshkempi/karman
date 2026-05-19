"use client"

import { useEffect, useState } from "react"
import { Heart, Search, Menu, X, ShoppingCart } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButtonClient from "@modules/layout/components/cart-button-client"
import { useCompareStore } from "global-states/use-compare"
import { CompareModal } from "@modules/products/components/compare-modal"
import { Button } from "@medusajs/ui"
import { useSearchParams } from "next/navigation"
import { SearchDropdown } from "@modules/search/dropdown/SearchDropdown"
import LoginPromptModal from "@modules/layout/components/login-prompt-modal"
import MegaMenu from "@modules/layout/components/mega-menu/MegaMenu"
import HeaderTopBar from "@modules/layout/components/header-top-bar"

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
  const [isScrolled, setIsScrolled] = useState(false)

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  // Static navigation items matching the design
  const staticNavItems = [
    { label: "ΣΧΕΤΙΚΑ ΜΕ ΜΑΣ", href: "/about" },
    { label: "ΕΠΙΚΟΙΝΩΝΙΑ", href: "/contact-us" },
    { label: "ΜΑΡΚΕΣ", href: "/brands" },
  ]

  return (
    <>
      {/* Fixed Header Wrapper - overlays the hero */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white shadow-md" 
            : "bg-black/30 backdrop-blur-md"
        }`}
      >
        {/* Top Bar - rendered inside the fixed wrapper */}
        <HeaderTopBar isScrolled={isScrolled} />

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div className="max-w-[1350px] mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-[72px]">
              {/* Left: Logo - white on dark hero, dark on white scroll */}
              <LocalizedClientLink href="/" className="flex-shrink-0">
                <img 
                  src={isScrolled 
                    ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aglopoulos-logo-dark-6zcp8YKLDWmlQ3XxDOW8RYqcWE6LJB.svg" 
                    : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agglopoulos%20racing-white-vMOxPHmoru1Ffq7OA9SrG8Lrt7BxpD.png"
                  } 
                  alt="Aglopoulos Racing" 
                  className="h-10 w-auto"
                />
              </LocalizedClientLink>

              {/* Center: Navigation Menu */}
              <div className="flex items-center gap-6 text-sm font-semibold uppercase">
                {/* Products Dropdown */}
                <MegaMenu
                  megaMenus={menu?.megaMenus}
                  isMobileMenuOpen={isMobileMenuOpen}
                  onMobileMenuToggle={setIsMobileMenuOpen}
                  isInline={true}
                  staticNavItems={[]}
                  isScrolled={isScrolled}
                />
                
                {/* Static Navigation Items */}
                {staticNavItems.map((item, index) => (
                  <LocalizedClientLink
                    key={index}
                    href={item.href}
                    className={`transition-colors whitespace-nowrap ${
                      isScrolled 
                        ? "text-gray-800 hover:text-red-600" 
                        : "text-white hover:text-white/80"
                    }`}
                  >
                    {item.label}
                  </LocalizedClientLink>
                ))}
              </div>

              {/* Right: Search, Icons Area */}
              <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative">
                  <div className={`rounded-full px-4 py-2 flex items-center w-72 transition-colors ${
                    isScrolled 
                      ? "bg-gray-100 border border-gray-200" 
                      : "bg-white/20 border border-white/30"
                  }`}>
                    <input
                      type="text"
                      placeholder="Αναζήτηση με κωδικό ή λέξη-κλειδί"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => query.trim() && setOpen(true)}
                      className={`w-full bg-transparent text-[13px] focus:outline-none ${
                        isScrolled 
                          ? "text-gray-800 placeholder:text-gray-500" 
                          : "text-white placeholder:text-white/70"
                      }`}
                    />
                    <Search size={18} className={`ml-2 flex-shrink-0 ${
                      isScrolled ? "text-gray-500" : "text-white"
                    }`} />
                  </div>
                </div>

                {/* Wishlist */}
                <LocalizedClientLink
                  href="/account/wishlist"
                  className={`relative flex flex-col items-center transition-colors ${
                    isScrolled 
                      ? "text-gray-800 hover:text-gray-600" 
                      : "text-white hover:text-white/80"
                  }`}
                >
                  <div className="relative">
                    <Heart size={24} />
                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-0.5 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold leading-none">
                      {wishlistCount}
                    </span>
                  </div>
                  <span className={`text-[11px] mt-0.5 ${
                    isScrolled ? "text-gray-600" : "text-white/80"
                  }`}>Αγαπημένα</span>
                </LocalizedClientLink>

                {/* Cart Button - red with icon and count only */}
                <LocalizedClientLink 
                  href="/cart" 
                  className="bg-[#ff0d00] hover:bg-[#e00c00] text-white px-3 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                  <ShoppingCart size={20} />
                  <span className="text-sm font-bold">{cartItemsCount}</span>
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="max-w-[1350px] mx-auto px-4">
            {/* Mobile Top Bar */}
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 bg-transparent border-none shadow-none ${
                    isScrolled ? "text-gray-800" : "text-white"
                  }`}
                >
                  {isMobileMenuOpen ? (
                    <X size={28} />
                  ) : (
                    <Menu size={28} />
                  )}
                </Button>
                <LocalizedClientLink href="/">
                  <img 
                    src={isScrolled 
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aglopoulos-logo-dark-6zcp8YKLDWmlQ3XxDOW8RYqcWE6LJB.svg" 
                      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agglopoulos%20racing-white-vMOxPHmoru1Ffq7OA9SrG8Lrt7BxpD.png"
                    } 
                    alt="Aglopoulos Racing" 
                    className="h-8 w-auto"
                  />
                </LocalizedClientLink>
              </div>

              <div className="flex items-center gap-2">
                <LocalizedClientLink
                  href="/account/wishlist"
                  className={`relative flex items-center p-2 ${
                    isScrolled ? "text-gray-800" : "text-white"
                  }`}
                >
                  <Heart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-semibold leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/cart"
                  className="relative flex items-center p-2 bg-red-600 rounded text-white"
                >
                  <ShoppingCart size={22} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-white text-red-600 text-[10px] font-semibold leading-none">
                      {cartItemsCount}
                    </span>
                  )}
                </LocalizedClientLink>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className={`py-3 px-4 transition-colors ${
            isScrolled 
              ? "bg-white border-t border-gray-100" 
              : "bg-transparent"
          }`}>
            <div className="relative">
              <div className={`flex items-center rounded-full overflow-hidden ${
                isScrolled 
                  ? "bg-gray-100 border border-gray-200" 
                  : "bg-white/20 border border-white/30"
              }`}>
                <div className={`flex items-center justify-center pl-3 ${
                  isScrolled ? "text-gray-500" : "text-white/70"
                }`}>
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Αναζήτηση με κωδικό ή λέξη κλειδί"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query.trim() && setOpen(true)}
                  className={`w-full h-[40px] px-3 bg-transparent text-[13px] focus:outline-none ${
                    isScrolled 
                      ? "text-gray-800 placeholder:text-gray-500" 
                      : "text-white placeholder:text-white/60"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only MegaMenu (handles mobile panel) */}
      <div className="lg:hidden">
        <MegaMenu
          megaMenus={menu?.megaMenus}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={setIsMobileMenuOpen}
          isInline={false}
          staticNavItems={staticNavItems}
          isScrolled={isScrolled}
        />
      </div>

      {isCompareOpen && (
        <CompareModal onClose={() => setIsCompareOpen(false)} />
      )}

      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
      />

      <SearchDropdown
        data={results}
        query={query}
        setQuery={setQuery}
        setOpen={setOpen}
        open={open}
      />
    </>
  )
}
