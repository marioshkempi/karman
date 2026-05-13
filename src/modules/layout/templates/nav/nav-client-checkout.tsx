"use client"

import { useState } from "react"
import { X, Menu } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Logo from "./logo"
import { HttpTypes } from "@medusajs/types"
import AccountMenu from "@modules/layout/components/user-account-widget/account-header-widget"
import { Button } from "@medusajs/ui"

interface CheckoutNavbarProps {
  headerLogo: string
  customer?: HttpTypes.StoreCustomer | null
}

export default function NavbarCheckoutClient({
  headerLogo,
  customer,
}: CheckoutNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white mt-3 border-b pb-3">
      <div className="max-w-[1440px] mx-auto px-3 md:px-6 lg:px-5">
        {/* MOBILE */}
        <div className="flex md:hidden items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 bg-transparent border-none shadow-none"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={30} />}
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

          <AccountMenu customer={customer} />
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center justify-between h-20">
          <LocalizedClientLink href="/">
            <Logo width={55} height={55} src={headerLogo} />
          </LocalizedClientLink>

          <AccountMenu customer={customer} />
        </div>
      </div>
    </nav>
  )
}
