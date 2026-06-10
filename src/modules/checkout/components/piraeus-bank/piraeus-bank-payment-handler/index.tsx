"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import Spinner from "@modules/common/icons/spinner"
import type {
  PiraeusBankInitiateResponse,
  PiraeusBankFormData,
} from "@lib/data/piraeus-bank"
import { useTranslations } from "next-intl"

type PiraeusBankPaymentHandlerProps = {
  cart: any
  cartId: string
}

// Client-side version of submitPiraeusBankForm
const submitPiraeusBankForm = (formData: PiraeusBankFormData): void => {
  const form = document.createElement("form")
  form.method = "POST"
  form.action = formData.api_url
  form.style.display = "none"

  const fieldMappings: Record<string, string> = {
    acquirer_id: "AcquirerId",
    merchant_id: "MerchantId",
    pos_id: "PosId",
    user: "User",
    language_code: "LanguageCode",
    merchant_reference: "MerchantReference",
    BillAddrCity: "BillAddrCity",
    BillAddrCountry: "BillAddrCountry",
    BillAddrLine1: "BillAddrLine1",
    BillAddrPostCode: "BillAddrPostCode",
    BillAddrState: "BillAddrState",
    ShipAddrCity: "ShipAddrCity",
    ShipAddrCountry: "ShipAddrCountry",
    ShipAddrLine1: "ShipAddrLine1",
    ShipAddrPostCode: "ShipAddrPostCode",
    ShipAddrState: "ShipAddrState",
    CardholderName: "CardholderName",
    Email: "Email",
    HomePhone: "HomePhone",
    MobilePhone: "MobilePhone",
    WorkPhone: "WorkPhone",
  }

  Object.entries(formData).forEach(([key, value]) => {
    if (key === "api_url") return

    const fieldName = fieldMappings[key] || key
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = fieldName
    input.value = String(value || "")
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}

const PiraeusBankPaymentHandler: React.FC<PiraeusBankPaymentHandlerProps> = ({
  cart,
  cartId,
}: PiraeusBankPaymentHandlerProps) => {
  const t = useTranslations()
  console.log(cart)
  const router = useRouter()
  const [selectedInstallments, setSelectedInstallments] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const installmentOptions = [
    { value: 0, label: "Χωρίς δόσεις" },
    { value: 3, label: "3 δόσεις" },
    { value: 6, label: "6 δόσεις" },
    { value: 9, label: "9 δόσεις" },
    { value: 12, label: "12 δόσεις" },
  ]

  const handleSubmitPayment = async () => {
    setIsProcessing(true)
    setErrorMessage(null)

    try {
      // Get language from locale or default to 'el'
      const language = document.documentElement.lang === "en" ? "en" : "el"

      // Call API route to initiate payment
      const response = await fetch("/api/checkout/piraeus-bank/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_id: cartId,
          installments: selectedInstallments,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error(t("checkout.connectionFailed"))
      }

      const data: PiraeusBankInitiateResponse = await response.json()

      if (!data.success) {
        throw new Error(data.message || data.error || t("checkout.paymentFailed"))
      }

      if (!data.form_data) {
        throw new Error(t("checkout.formDataNotFound"))
      }

      // Submit form - this will redirect to Piraeus Bank
      submitPiraeusBankForm(data.form_data)
    } catch (error) {
      console.error("Payment error:", error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("checkout.errorDuringPayment")
      )
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">{t("checkout.completePayment")}</h1>

        {/* Cart Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="font-semibold mb-2">{t("checkout.orderSummary")}</h2>
          <div className="flex justify-between text-sm mb-1">
            <span>{t("navigation.products")} ({cart.items?.length})</span>
            <span>{(cart.item_subtotal ?? 0).toFixed(2)}€</span>
          </div>
          {cart.shipping_methods?.length > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span>{cart.shipping_methods[0].name ?? t("checkout.shipping")}</span>
              <span>
                {(cart.shipping_total ?? 0) > 0
                  ? `${cart.shipping_total.toFixed(2)}€`
                  : t("common.free")}
              </span>
            </div>
          )}
          {(cart.discount_total ?? 0) > 0 && (
            <div className="flex justify-between text-sm mb-1 text-green-600">
              <span>{t("cart.discount")}</span>
              <span>-{cart.discount_total.toFixed(2)}€</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>{t("cart.total")}</span>
            <span>{(cart.total ?? 0).toFixed(2)}€</span>
          </div>
        </div>

        {/* Installments Selection */}
        {/*<div className="mb-6">*/}
        {/*  <label className="block text-sm font-medium mb-2">*/}
        {/*    Επιλέξτε αριθμό δόσεων*/}
        {/*  </label>*/}
        {/*  <select*/}
        {/*    value={selectedInstallments}*/}
        {/*    onChange={(e) => setSelectedInstallments(Number(e.target.value))}*/}
        {/*    disabled={isProcessing}*/}
        {/*    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-oceanBlue focus:border-transparent disabled:opacity-50"*/}
        {/*  >*/}
        {/*    {installmentOptions.map((option) => (*/}
        {/*      <option key={option.value} value={option.value}>*/}
        {/*        {option.label}*/}
        {/*      </option>*/}
        {/*    ))}*/}
        {/*  </select>*/}
        {/*  {selectedInstallments > 0 && cart.total && (*/}
        {/*    <p className="text-sm text-gray-600 mt-2">*/}
        {/*      Μηνιαία δόση: ~*/}
        {/*      {(cart.total / 100 / selectedInstallments).toFixed(2)}€*/}
        {/*    </p>*/}
        {/*  )}*/}
        {/*</div>*/}

        {errorMessage && <ErrorMessage error={errorMessage} />}

        <button
          onClick={handleSubmitPayment}
          disabled={isProcessing}
          className="w-full bg-[#FF8C00] rounded-[4px] px-4 py-3 text-center text-white font-medium hover:bg-[#E67E00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Spinner />
              <span>{t("checkout.processing")}</span>
            </>
          ) : (
            <span>{t("checkout.continueToPaymentAction")}</span>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          {t("checkout.piraeusBankRedirectNote")}
        </p>
      </div>
    </div>
  )
}

export default PiraeusBankPaymentHandler
