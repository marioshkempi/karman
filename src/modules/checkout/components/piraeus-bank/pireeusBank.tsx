"use client"

import { useState, useRef } from "react"
import { initiatePiraeusBankPayment, PiraeusBankInitiateResponse } from "@lib/data/piraeus-bank"
import { useTranslations } from "next-intl"

type PaymentState = "idle" | "loading" | "ready" | "submitting" | "error"

type PiraeusBankPaymentClientProps = {
  cartId: string
}

export default function PiraeusBankPaymentClient({ cartId }: PiraeusBankPaymentClientProps) {
  const t = useTranslations()
  const formRef = useRef<HTMLFormElement>(null)

  const [state, setState] = useState<PaymentState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PiraeusBankInitiateResponse | null>(null)
  const [installments, setInstallments] = useState(0)
  const language = "el" // or get from your i18n context

  const handleSubmit = async () => {
    if (!cartId) {
      setError(t("checkout.cartNotFound"))
      setState("error")
      return
    }

    try {
      setState("loading")
      setError(null)

      // Call the API to create transaction and issue ticket
      const response = await initiatePiraeusBankPayment(
        cartId,
        installments,
        language
      )

      if (!response.success) {
        throw new Error(
          response.error ||
          response.message ||
          t("checkout.paymentInitError")
        )
      }

      if (!response.form_data || !response.ticket) {
        throw new Error(t("checkout.paymentDataNotReceived"))
      }

      setPaymentData(response)
      setState("ready")

      // Auto-submit after short delay
      setTimeout(() => {
        setState("submitting")
        formRef.current?.submit()
      }, 100)

    } catch (err) {
      console.error("Payment initiation error:", err)
      setError(err instanceof Error ? err.message : t("checkout.errorOccurred"))
      setState("error")
    }
  }

  const handleGoBack = () => {
    window.history.back()
  }

  // Idle state - show installments selector and pay button
  if (state === "idle" || state === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {t("checkout.paymentWithPiraeusBank")}
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Installments Selector */}
          <div className="mb-6">
            <label
              htmlFor="installments"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("checkout.installmentsLabel")}
            </label>
            <select
              id="installments"
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>{t("checkout.oneTimePayment")}</option>
              <option value={3}>3 {t("checkout.installmentsSuffix")}</option>
              <option value={6}>6 {t("checkout.installmentsSuffix")}</option>
              <option value={12}>12 {t("checkout.installmentsSuffix")}</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleGoBack}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t("common.back")}
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t("checkout.payment")}
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500 text-center">
            {t("checkout.piraeusBankRedirectAlt")}
          </p>
        </div>
      </div>
    )
  }

  // Loading state
  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            {t("checkout.preparingPayment")}
          </h1>
          <p className="text-gray-600">{t("checkout.pleaseWait")}</p>
        </div>
      </div>
    )
  }

  // Ready/Submitting state - show redirect message and hidden form
  if ((state === "ready" || state === "submitting") && paymentData?.form_data) {
    const { form_data } = paymentData

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            {t("checkout.transferringToBank")}
          </h1>
          <p className="text-gray-600 mb-4">
            {t("checkout.piraeusBankRedirectAlt")}
          </p>

          {/* Payment Summary */}
          {paymentData.cart_data && (
            <div className="bg-white rounded-lg p-4 mb-4 text-left max-w-sm mx-auto shadow-sm">
              <h2 className="font-semibold mb-2 text-gray-800">{t("checkout.summary")}</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>{t("checkout.amount")}:</span>
                  <span className="font-medium">€{paymentData.cart_data.total_amount.toFixed(2)}</span>
                </div>
                {installments > 0 && (
                  <div className="flex justify-between">
                    <span>{t("checkout.installmentsCount")}:</span>
                    <span className="font-medium">{installments}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t("checkout.reference")}:</span>
                  <span className="font-medium font-mono text-xs">{paymentData.merchant_reference}</span>
                </div>
              </div>
            </div>
          )}

          {/* Hidden form */}
          <form
            ref={formRef}
            method="POST"
            action={form_data.api_url}
            className="hidden"
          >
            <input type="hidden" name="AcquirerId" value={form_data.acquirer_id} />
            <input type="hidden" name="MerchantId" value={form_data.merchant_id} />
            <input type="hidden" name="PosId" value={form_data.pos_id} />
            <input type="hidden" name="User" value={form_data.user} />
            <input type="hidden" name="LanguageCode" value={form_data.language_code} />
            <input type="hidden" name="MerchantReference" value={form_data.merchant_reference} />
            <input type="hidden" name="BillAddrCity" value={form_data.BillAddrCity} />
            <input type="hidden" name="BillAddrCountry" value={form_data.BillAddrCountry} />
            <input type="hidden" name="BillAddrLine1" value={form_data.BillAddrLine1} />
            <input type="hidden" name="BillAddrPostCode" value={form_data.BillAddrPostCode} />
            <input type="hidden" name="BillAddrState" value={form_data.BillAddrState} />
            <input type="hidden" name="ShipAddrCity" value={form_data.ShipAddrCity} />
            <input type="hidden" name="ShipAddrCountry" value={form_data.ShipAddrCountry} />
            <input type="hidden" name="ShipAddrLine1" value={form_data.ShipAddrLine1} />
            <input type="hidden" name="ShipAddrPostCode" value={form_data.ShipAddrPostCode} />
            <input type="hidden" name="ShipAddrState" value={form_data.ShipAddrState} />
            <input type="hidden" name="CardholderName" value={form_data.CardholderName} />
            <input type="hidden" name="Email" value={form_data.Email} />
            <input type="hidden" name="HomePhone" value={form_data.HomePhone} />
            <input type="hidden" name="MobilePhone" value={form_data.MobilePhone} />
            <input type="hidden" name="WorkPhone" value={form_data.WorkPhone} />
          </form>

          {/* Fallback button */}
          <button
            onClick={() => formRef.current?.submit()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            {t("checkout.clickHereIfNotRedirected")}
          </button>
        </div>
      </div>
    )
  }

  return null
}