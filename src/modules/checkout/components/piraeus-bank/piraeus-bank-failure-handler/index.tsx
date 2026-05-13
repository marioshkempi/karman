"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

type PiraeusBankFailureHandlerProps = {
  resultDescription?: string
  merchantReference?: string
}

const PiraeusBankFailureHandler: React.FC<PiraeusBankFailureHandlerProps> = ({
                                                                               resultDescription: initialResultDescription,
                                                                               merchantReference: initialMerchantReference,
                                                                             }) => {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const processFailure = async () => {
      const resultDescription =
        searchParams.get("ResultDescription") ||
        initialResultDescription ||
        t("checkout.transactionFailed")

      const merchantReference =
        searchParams.get("MerchantReference") || initialMerchantReference

      setMessage(resultDescription)

      // Log the failure to backend
      if (merchantReference) {
        try {
          await fetch("/api/checkout/piraeus-bank/failure", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              merchant_reference: merchantReference,
              result_description: resultDescription,
              result_code: searchParams.get("ResultCode"),
            }),
          })
        } catch (error) {
          console.error("Failed to log payment failure:", error)
        }
      }
    }

    processFailure()
  }, [searchParams, initialResultDescription, initialMerchantReference])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-red-600 text-6xl mb-6">✕</div>
        <h1 className="text-3xl font-bold text-red-900 mb-4">
          {t("checkout.paymentFailed")}
        </h1>
        <p className="text-red-700 text-lg mb-8">{message}</p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-oceanBlue text-white px-6 py-3 rounded hover:opacity-90"
          >
            {t("checkout.tryAgain")}
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300"
          >
            {t("checkout.returnToCart")}
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-6">
          {t("checkout.contactCustomerService")}
        </p>
      </div>
    </div>
  )
}

export default PiraeusBankFailureHandler