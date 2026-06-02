"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { getCookie } from "@lib/util/cookies"
import { useTranslations } from "next-intl"
import { ArrowRight, Tag } from "lucide-react"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  customer: HttpTypes.StoreCustomer | null
}

function getCheckoutStep(
  cart: HttpTypes.StoreCart,
  customer: HttpTypes.StoreCustomer | null
) {
  if (!customer) {
    const guestFirstName = getCookie("guest_first_name")
    const guestLastName = getCookie("guest_last_name")
    const guestAddress = getCookie("guest_address")

    if (!guestFirstName || !guestLastName || !guestAddress) {
      return "personal"
    }
  }
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, customer }: SummaryProps) => {
  const step = getCheckoutStep(cart, customer)
  const t = useTranslations()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
      {/* Totals */}
      <CartTotals totals={cart} />

      {/* Promo Code */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <DiscountCode cart={cart} />
      </div>

      {/* Checkout Button */}
      <div className="mt-4">
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <button className="w-full h-12 bg-[#FF8C00] hover:bg-[#F97316] text-white font-semibold text-[15px] rounded-full flex items-center justify-center gap-2 transition-colors">
            {t("cart.goToCheckout")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Summary
