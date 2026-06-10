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
    <div className="bg-white rounded-[20px] border border-black/10 p-6">
      {/* Totals */}
      <CartTotals totals={cart} />

      {/* Promo Code */}
      <div className="mt-6 pt-6 border-t border-black/10">
        <DiscountCode cart={cart} />
      </div>

      {/* Checkout Button */}
      <div className="mt-6">
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <button className="w-full h-[60px] bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-[15px] rounded-[62px] flex items-center justify-center gap-3 transition-colors">
            {t("cart.goToCheckout")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Summary
