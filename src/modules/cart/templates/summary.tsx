"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { getCookie } from "@lib/util/cookies"
import { useTranslations } from "next-intl"

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
  // if (!customer) {
  //   return "personal"
  // }
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
    <div className="flex flex-col gap-y-4 border-2 border-primary rounded-md p-4">
      <CartTotals totals={cart} />
      <DiscountCode cart={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <button className="w-full h-12 bg-primary hover:bg-secondary text-white uppercase font-medium text-sm tracking-wide">
          {t("cart.completeCheckout")}
        </button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
