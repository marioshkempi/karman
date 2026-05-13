"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Spinner from "@modules/common/icons/spinner"
import { CheckCircle, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"

type PiraeusBankSuccessHandlerProps = {
  merchantReference?: string
}

const PiraeusBankSuccessHandler: React.FC<PiraeusBankSuccessHandlerProps> = ({
  merchantReference: initialMerchantReference,
}) => {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [alreadyProcessed, setAlreadyProcessed] = useState(false)

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get all data from URL parameters (Piraeus sends via GET/POST)
        const resultCode = searchParams.get("ResultCode")
        const merchantReference =
          searchParams.get("MerchantReference") || initialMerchantReference
        const statusFlag = searchParams.get("StatusFlag")
        const responseCode = searchParams.get("ResponseCode")

        if (!merchantReference) {
          throw new Error(t("checkout.transactionRefNotFound"))
        }

        // Quick client-side validation before API call
        if (resultCode !== "0") {
          const resultDescription = searchParams.get("ResultDescription")
          throw new Error(
            resultDescription || t("checkout.paymentNotCompleted")
          )
        }

        if (statusFlag === "Failure") {
          throw new Error(t("checkout.transactionNotApproved"))
        }

        // Collect all bank response data
        const bankData = {
          ResultCode: resultCode,
          ResultDescription: searchParams.get("ResultDescription"),
          StatusFlag: statusFlag,
          ResponseCode: responseCode,
          ResponseDescription: searchParams.get("ResponseDescription"),
          MerchantReference: merchantReference,
          TransactionId: searchParams.get("TransactionId"),
          SupportReferenceID: searchParams.get("SupportReferenceID"),
          PackageNo: searchParams.get("PackageNo"),
          AuthStatus: searchParams.get("AuthStatus"),
          ApprovalCode: searchParams.get("ApprovalCode"),
          HashKey: searchParams.get("HashKey"),
          Parameters: searchParams.get("Parameters"),
        }

        // Call Next.js API route which uses the data layer
        const response = await fetch("/api/checkout/piraeus-bank/success", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bankData),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || data.message || t("checkout.processingPaymentError")
          )
        }

        setOrderId(data.order_id)
        setAlreadyProcessed(data.already_processed || false)
        setIsProcessing(false)

        // Redirect to order confirmation after showing success message
        setTimeout(
          () => {
            if (data.redirect_url) {
              router.push(data.redirect_url)
            } else if (data.order_id) {
              router.push(`/order/confirmed/${data.order_id}`)
            } else {
              router.push("/account/orders")
            }
          },
          alreadyProcessed ? 1000 : 2000
        )
      } catch (err) {
        console.error("Payment processing error:", err)
        setError(err instanceof Error ? err.message : t("checkout.errorOccurred"))
        setIsProcessing(false)
      }
    }

    processPayment()
  }, [searchParams, initialMerchantReference, router, alreadyProcessed])

  // Error state
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <XCircle className="mx-auto mb-4 text-red-600" size={64} />
            <h1 className="text-2xl font-bold text-red-900 mb-4">
              {t("checkout.paymentError")}
            </h1>
            <p className="text-red-700 mb-6">{error}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => router.push("/cart")}
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
              >
                {t("checkout.returnToCart")}
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                {t("checkout.homePage")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Processing/Success state
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {isProcessing ? (
            <>
              <div className="flex justify-center mb-6">
                <Spinner />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t("checkout.processingPayment")}
              </h1>
              <p className="text-gray-600">
                {t("checkout.pleaseWait")}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                {t("checkout.doNotClose")}
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="mx-auto mb-6 text-green-600" size={64} />
              <h1 className="text-2xl font-bold text-green-900 mb-4">
                {alreadyProcessed
                  ? t("checkout.paymentAlreadyProcessed")
                  : t("checkout.paymentCompleted")}
              </h1>
              <p className="text-gray-600 mb-6">
                {alreadyProcessed
                  ? t("checkout.orderAlreadyRegistered")
                  : t("checkout.orderRegistered")}
              </p>
              {orderId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">
                    {t("checkout.orderNumberLabel")}
                  </p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    {orderId}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                {t("checkout.redirectingToOrder")}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PiraeusBankSuccessHandler
