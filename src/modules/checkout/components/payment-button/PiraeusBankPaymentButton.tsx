"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "../error-message"
import { initiatePaymentSession } from "@lib/data/cart"
import { useTranslations } from "next-intl"

type PiraeusBankPaymentButtonProps = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  disabled?: boolean
  "data-testid"?: string
}

const PiraeusBankPaymentButton: React.FC<PiraeusBankPaymentButtonProps> = ({
                                                                             cart,
                                                                             notReady,
                                                                             disabled = false,
                                                                             "data-testid": dataTestId,
                                                                           }) => {
  const t = useTranslations()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePayment = () => {
    if (!cart?.id) {
      setErrorMessage(t("checkout.cartNotFound"))
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    // Just redirect to the payment page
    // cart_id comes from cookie, installments will be selected on the page
    router.push("/checkout/piraeus-bank/validate")
  }

  const isDisabled = notReady || submitting || disabled || !cart?.id

  return (
    <>
      <button
        disabled={isDisabled}
        onClick={handlePayment}
        className=" bg-[#FF8C00] rounded-[4px] px-4 py-2.5 sm:py-3 text-center text-white font-medium hover:bg-[#E67E00] transition-colors  disabled:cursor-not-allowed"
        data-testid={dataTestId || "piraeus-payment-button"}
      >
        {submitting ? t("common.loading") : t("checkout.completeOrder")}
      </button>

      <ErrorMessage
        error={errorMessage}
        data-testid="piraeus-payment-error-message"
      />
    </>
  )
}

export default PiraeusBankPaymentButton
