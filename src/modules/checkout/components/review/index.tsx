"use client"

import { useState } from "react"
import { Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Input from "@modules/common/components/input"
import PaymentButton from "../payment-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CheckoutStepHeader from "@modules/checkout/components/checkout-steps-heading"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [orderNote, setOrderNote] = useState("")

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  const getPathWithoutCountryCode = () => {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length > 1 && parts[0] && parts[0].length === 2) {
      return "/" + parts.slice(1).join("/")
    }
    return pathname
  }

  const handleEdit = () => {
    router.push(getPathWithoutCountryCode() + "?step=review", { scroll: false })
  }

  return (
    <div className="bg-white">
      <CheckoutStepHeader
        title="Σχόλιο"
        isOpen={isOpen}
        isCompleted={previousStepsCompleted}
        onEdit={handleEdit}
        editLabel="Επεξεργασία"
        testId="edit-review-button"
      />
      {isOpen && previousStepsCompleted && (
        <>
          <div className="space-y-4 lg:space-y-6 mb-4 lg:mb-6">
            {/* Textarea for order comment */}
            <div>
              <p className="text-[13px] lg:text-[14px] text-black mb-3">
                Θα θέλατε να προσθέσετε ένα σχόλιο σχετικά με την παραγγελία
                σας;
              </p>
              <textarea
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3  border-tertiary text-black text-[14px] lg:text-base rounded-[4px] focus:outline-none focus:ring-0 border resize-none"
                rows={4}
                placeholder=""
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                maxLength={500}
              />
              {orderNote.length > 0 && (
                <p className="text-xs text-gray-400 text-right mt-1">
                  {orderNote.length}/500
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 border border-gray-300 cursor-pointer focus:outline-none flex-shrink-0 accent-orange"
              />
              <span className="text-[13px] lg:text-[14px]">
                <span className="text-black">Συμφωνώ με τους </span>
                <span className="text-orange underline">
                  <LocalizedClientLink href={"/3-oroi-xrisis"}>
                    όρους χρήσης
                  </LocalizedClientLink>
                </span>
              </span>
            </label>
          </div>

          <PaymentButton
            cart={cart}
            data-testid="submit-order-button"
            disabled={!termsAccepted}
            orderNote={orderNote}
          />
        </>
      )}
    </div>
  )
}

export default Review
