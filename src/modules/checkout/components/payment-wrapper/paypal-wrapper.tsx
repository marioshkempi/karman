"use client"

import {
  PayPalButtons,
  PayPalCardFieldsForm,
  PayPalCardFieldsProvider,
  PayPalScriptProvider,
  usePayPalCardFields,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js"
import { useEffect, useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { completeCart, updateCartMetadata } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useTranslations } from "next-intl"

type Props = {
  cart: HttpTypes.StoreCart
  notReady?: boolean
  disabled?: boolean
  orderNote?: string
  "data-testid"?: string
}

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// ─── Outer component: mounts the PayPal SDK provider ─────────────────────────

const PayPalPaymentButton = (props: Props) => {
  const t = useTranslations()
  const [clientToken, setClientToken] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)

  if (!paypalClientId) {
    return (
      <div className="text-sm text-red-600 py-2">
        {t("checkout.paypalNotConfigured")}
      </div>
    )
  }

  // Fetch the PayPal client token required for card fields.
  useEffect(() => {
    let cancelled = false

    const fetchClientToken = async () => {
      try {
        const res = await fetch(`${medusaUrl}/store/paypal/client-token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(publishableKey && {
              "x-publishable-api-key": publishableKey,
            }),
          },
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch PayPal client token (${res.status})`)
        }

        const data = await res.json()
        if (!cancelled) setClientToken(data.clientToken)
      } catch (err: any) {
        console.error("PayPal client token fetch failed", err)
        if (!cancelled) {
          setTokenError(err?.message || "Failed to initialize PayPal")
        }
      }
    }

    fetchClientToken()

    return () => {
      cancelled = true
    }
  }, [])

  const currency = (props.cart.region?.currency_code || "EUR").toUpperCase()

  // Memoize options by value so the provider doesn't reset on every parent
  // re-render. Only reconfigures when a primitive actually changes.
  const options = useMemo(
    () => ({
      clientId: paypalClientId!,
      currency,
      intent: "capture" as const,
      components: "buttons,card-fields",
      ...(clientToken && { dataClientToken: clientToken }),
    }),
    [currency, clientToken]
  )

  // Defer SDK script download until the client token has arrived.
  // Card fields require dataClientToken at load time.
  const deferLoading = !clientToken

  return (
    <PayPalScriptProvider deferLoading={deferLoading} options={options}>
      {!clientToken && !tokenError && (
        <div className="text-sm text-gray-500 py-2">{t("checkout.loadingPayment")}</div>
      )}
      {tokenError && (
        <div className="text-sm text-red-600 py-2">{tokenError}</div>
      )}
      {clientToken && <PayPalPaymentButtonInner {...props} />}
    </PayPalScriptProvider>
  )
}

// ─── Inner component: runs inside the provider ───────────────────────────────

const PayPalPaymentButtonInner = ({
  cart,
  notReady,
  disabled,
  orderNote = "",
  "data-testid": dataTestId,
}: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [{ isPending, isResolved }] = usePayPalScriptReducer()
  const [error, setError] = useState<string | null>(null)

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s: any) => s.status === "pending"
  )
  const paypalOrderId = paymentSession?.data?.id as string | undefined

  const countryCode = pathname.split("/").filter(Boolean)[0] || ""
  const countryPrefix = countryCode.length === 2 ? `/${countryCode}` : ""

  const createOrder = async () => {
    if (!paypalOrderId) throw new Error("PayPal order ID missing")
    return paypalOrderId
  }

  const onApprove = async () => {
    try {
      if (orderNote.trim()) {
        await updateCartMetadata({ message: orderNote.trim() })
      }

      const result = await completeCart()

      if (result.type !== "order") {
        setError(t("checkout.paymentNotCompleted"))
        return
      }

      router.push(`${countryPrefix}/order/${result.orderId}/confirmed`)
    } catch (err: any) {
      setError(err?.message || t("checkout.paymentNotCompleted"))
    }
  }

  if (!paypalOrderId) {
    return (
      <div className="text-sm text-red-600 py-2" data-testid={dataTestId}>
        {t("checkout.paypalSessionNotFound")}
      </div>
    )
  }

  if (isPending || !isResolved) {
    return (
      <div className="text-sm text-gray-500 py-2" data-testid={dataTestId}>
        {t("checkout.loadingPayment")}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4" data-testid={dataTestId}>
      {/* Express PayPal button */}
      <PayPalButtons
        forceReRender={[paypalOrderId, disabled, notReady]}
        disabled={notReady || disabled}
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
          height: 45,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={() => setError(null)}
        onError={(err) => {
          console.error("PayPal button error:", err)
          setError(
            typeof err === "string"
              ? err
              : err instanceof Error
              ? err.message
              : t("checkout.paypalFailed")
          )
        }}
      />

      {/* Divider */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="flex-1 h-px bg-gray-200" />
        <span>{t("checkout.orPayWithCard")}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Card fields */}
      <PayPalCardFieldsProvider
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error("PayPal card fields error:", err)
          setError(t("checkout.paymentNotCompleted"))
        }}
        style={{
          input: {
            "font-size": "14px",
            "font-family": "Inter, sans-serif",
            color: "#111827",
          },
          ".invalid": { color: "#dc2626" },
        }}
      >
        <div className="flex flex-col gap-3">
          <PayPalCardFieldsForm />
          <CardSubmitButton disabled={disabled || notReady} />
        </div>
      </PayPalCardFieldsProvider>

      <ErrorMessage error={error} />
    </div>
  )
}

const CardSubmitButton = ({ disabled }: { disabled?: boolean }) => {
  const t = useTranslations()
  const { cardFieldsForm } = usePayPalCardFields()
  const [submitting, setSubmitting] = useState(false)

  const handleClick = async () => {
    if (!cardFieldsForm) return
    setSubmitting(true)
    try {
      await cardFieldsForm.submit()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || submitting}
      className="w-full h-12 bg-primary hover:bg-secondary text-white uppercase font-medium text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {submitting ? t("checkout.processing") : t("checkout.payWithCard")}
    </button>
  )
}

export default PayPalPaymentButton
