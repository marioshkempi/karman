"use client"

import {
  isBankTransfer,
  isCashOnDelivery,
  isManual,
  isPayInStore,
  isPaypal,
  isPiraeus,
  isStripe,
} from "@lib/constants"
import { placeOrder, updateCartMetadata } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { useTranslations } from "next-intl"
import PiraeusBankPaymentButton from "@modules/checkout/components/payment-button/PiraeusBankPaymentButton"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import PayPalPaymentButton from "@modules/checkout/components/payment-wrapper/paypal-wrapper"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
  disabled?: boolean
  orderNote?: string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
  disabled = false,
  orderNote = "",
}) => {
  const t = useTranslations()
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )
  const providerId = paymentSession?.provider_id

  const renderButton = () => {
    switch (true) {
      case isStripe(providerId):
        return (
          <StripePaymentButton
            notReady={notReady}
            cart={cart}
            data-testid={dataTestId}
          />
        )
      case isManual(providerId):
        return (
          <ManualTestPaymentButton
            notReady={notReady}
            data-testid={dataTestId}
            disabled={disabled}
          />
        )
      case isCashOnDelivery(providerId):
        return (
          <CashOnDeliveryPaymentButton
            notReady={notReady}
            data-testid={dataTestId}
            disabled={disabled}
          />
        )
      case isPiraeus(providerId):
        return (
          <PiraeusBankPaymentButton
            notReady={notReady}
            data-testid={dataTestId}
            disabled={disabled}
            cart={cart}
          />
        )
      case isPayInStore(providerId):
        return (
          <PayInStorePaymentButton
            notReady={notReady}
            data-testid={dataTestId}
            disabled={disabled}
            orderNote={orderNote}
          />
        )
      case isBankTransfer(providerId):
        return (
          <BankTransferPaymentButton
            notReady={notReady}
            data-testid={dataTestId}
            disabled={disabled}
            orderNote={orderNote}
          />
        )
      case isPaypal(providerId):
        return (
          <PayPalPaymentButton
            notReady={notReady}
            cart={cart}
            data-testid={dataTestId}
            disabled={disabled}
            orderNote={orderNote}
          />
        )
      default:
        return (
          <button
            disabled
            className="px-6 py-3 bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {t("checkout.selectPaymentMethod")}
          </button>
        )
    }
  }

  // PaymentWrapper mounts the correct SDK provider (Stripe Elements for Stripe,
  // PayPalScriptProvider for PayPal). For other providers it's a passthrough,
  // so it's safe to wrap the entire dispatcher here.
  return <PaymentWrapper cart={cart}>{renderButton()}</PaymentWrapper>
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const t = useTranslations()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <button
        disabled={disabled || notReady || submitting}
        onClick={handlePayment}
        className="px-6 py-3 bg-[#FF8C00] text-white font-medium hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        data-testid={dataTestId}
      >
        {submitting ? t("common.loading") : t("common.complete")}
      </button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
  disabled = false,
}: {
  notReady: boolean
  "data-testid"?: string
  disabled?: boolean
}) => {
  const t = useTranslations()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <button
        disabled={notReady || submitting || disabled}
        onClick={handlePayment}
        className="px-6 py-3 bg-[#FF8C00] text-white font-medium hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        data-testid={dataTestId || "submit-order-button"}
      >
        {submitting ? t("common.loading") : t("common.complete")}
      </button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const CashOnDeliveryPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
  disabled = false,
}: {
  notReady: boolean
  "data-testid"?: string
  disabled?: boolean
}) => {
  const t = useTranslations()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <button
        disabled={notReady || submitting || disabled}
        onClick={handlePayment}
        className="px-6 py-3 bg-[#FF8C00] text-white font-medium hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        data-testid={dataTestId || "submit-order-button"}
      >
        {submitting ? t("common.loading") : t("common.complete")}
      </button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const PayInStorePaymentButton = ({
  notReady,
  disabled,
  orderNote = "",
  "data-testid": dataTestId,
}: {
  notReady: boolean
  disabled?: boolean
  orderNote?: string
  "data-testid"?: string
}) => {
  const t = useTranslations()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    if (orderNote.trim()) {
      await updateCartMetadata({ message: orderNote.trim() })
    }
    await placeOrder()
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setSubmitting(false))
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <button
        disabled={notReady || submitting || disabled}
        onClick={handlePayment}
        className="w-full bg-[#FF8C00] rounded-[4px] px-4 py-2.5 sm:py-3 text-center text-white font-medium hover:bg-[#E67E00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid={dataTestId || "submit-order-button"}
      >
        {submitting ? t("common.loading") : t("checkout.completeOrder")}
      </button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const BankTransferPaymentButton = ({
  notReady,
  disabled,
  orderNote = "",
  "data-testid": dataTestId,
}: {
  notReady: boolean
  disabled?: boolean
  orderNote?: string
  "data-testid"?: string
}) => {
  const t = useTranslations()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    if (orderNote.trim()) {
      await updateCartMetadata({ message: orderNote.trim() })
    }
    await placeOrder()
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setSubmitting(false))
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <button
        disabled={notReady || submitting || disabled}
        onClick={handlePayment}
        className="w-full bg-[#FF8C00] rounded-[4px] px-4 py-2.5 sm:py-3 text-center text-white font-medium hover:bg-[#E67E00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid={dataTestId || "submit-order-button"}
      >
        {submitting ? t("common.loading") : t("checkout.completeOrder")}
      </button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton


// "use client"
//
// import {
//   isBankTransfer,
//   isCashOnDelivery,
//   isManual,
//   isPayInStore,
//   isPaypal,
//   isPiraeus,
//   isStripe,
// } from "@lib/constants"
// import { placeOrder, updateCartMetadata } from "@lib/data/cart"
// import { HttpTypes } from "@medusajs/types"
// import { useElements, useStripe } from "@stripe/react-stripe-js"
// import React, { useState } from "react"
// import ErrorMessage from "../error-message"
// import PiraeusBankPaymentButton from "@modules/checkout/components/payment-button/PiraeusBankPaymentButton"
// import { PayPalButtons } from "@paypal/react-paypal-js"
// import { authorizePaymentSession } from "@lib/data/payment"
//
// type PaymentButtonProps = {
//   cart: HttpTypes.StoreCart
//   "data-testid": string
//   disabled?: boolean
//   orderNote?: string
// }
//
// const PaymentButton: React.FC<PaymentButtonProps> = ({
//   cart,
//   "data-testid": dataTestId,
//   disabled = false,
//   orderNote = "",
// }) => {
//   const notReady =
//     !cart ||
//     !cart.shipping_address ||
//     !cart.billing_address ||
//     !cart.email ||
//     (cart.shipping_methods?.length ?? 0) < 1
//
//   const paymentSession = cart.payment_collection?.payment_sessions?.[0]
//
//   switch (true) {
//     case isStripe(paymentSession?.provider_id):
//       return (
//         <StripePaymentButton
//           notReady={notReady}
//           cart={cart}
//           data-testid={dataTestId}
//         />
//       )
//     case isManual(paymentSession?.provider_id):
//       return (
//         <ManualTestPaymentButton
//           notReady={notReady}
//           data-testid={dataTestId}
//           disabled={disabled}
//         />
//       )
//     case isCashOnDelivery(paymentSession?.provider_id):
//       return (
//         <CashOnDeliveryPaymentButton
//           notReady={notReady}
//           data-testid={dataTestId}
//           disabled={disabled}
//         />
//       )
//     case isPiraeus(paymentSession?.provider_id):
//       return (
//         <PiraeusBankPaymentButton
//           notReady={notReady}
//           data-testid={dataTestId}
//           disabled={disabled}
//           cart={cart}
//         />
//       )
//     case isPayInStore(paymentSession?.provider_id):
//       return (
//         <PayInStorePaymentButton
//           notReady={notReady}
//           data-testid={dataTestId}
//           disabled={disabled}
//           orderNote={orderNote}
//         />
//       )
//     case isBankTransfer(paymentSession?.provider_id):
//       return (
//         <BankTransferPaymentButton
//           notReady={notReady}
//           data-testid={dataTestId}
//           disabled={disabled}
//           orderNote={orderNote}
//         />
//       )
//     case isPaypal(paymentSession?.provider_id):
//       return (
//         <PayPalPaymentButton
//           notReady={notReady}
//           cart={cart}
//           data-testid={dataTestId}
//           disabled={disabled}
//           orderNote={orderNote}
//         />
//       )
//     default:
//       return (
//         <button
//           disabled
//           className="px-6 py-3 bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
//         >
//           Select a payment method
//         </button>
//       )
//   }
// }
//
// const StripePaymentButton = ({
//   cart,
//   notReady,
//   "data-testid": dataTestId,
// }: {
//   cart: HttpTypes.StoreCart
//   notReady: boolean
//   "data-testid"?: string
// }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//
//   const onPaymentCompleted = async () => {
//     await placeOrder()
//       .catch((err) => {
//         setErrorMessage(err.message)
//       })
//       .finally(() => {
//         setSubmitting(false)
//       })
//   }
//
//   const stripe = useStripe()
//   const elements = useElements()
//   const card = elements?.getElement("card")
//
//   const session = cart.payment_collection?.payment_sessions?.find(
//     (s) => s.status === "pending"
//   )
//
//   const disabled = !stripe || !elements ? true : false
//
//   const handlePayment = async () => {
//     setSubmitting(true)
//
//     if (!stripe || !elements || !card || !cart) {
//       setSubmitting(false)
//       return
//     }
//
//     await stripe
//       .confirmCardPayment(session?.data.client_secret as string, {
//         payment_method: {
//           card: card,
//           billing_details: {
//             name:
//               cart.billing_address?.first_name +
//               " " +
//               cart.billing_address?.last_name,
//             address: {
//               city: cart.billing_address?.city ?? undefined,
//               country: cart.billing_address?.country_code ?? undefined,
//               line1: cart.billing_address?.address_1 ?? undefined,
//               line2: cart.billing_address?.address_2 ?? undefined,
//               postal_code: cart.billing_address?.postal_code ?? undefined,
//               state: cart.billing_address?.province ?? undefined,
//             },
//             email: cart.email,
//             phone: cart.billing_address?.phone ?? undefined,
//           },
//         },
//       })
//       .then(({ error, paymentIntent }) => {
//         if (error) {
//           const pi = error.payment_intent
//
//           if (
//             (pi && pi.status === "requires_capture") ||
//             (pi && pi.status === "succeeded")
//           ) {
//             onPaymentCompleted()
//           }
//
//           setErrorMessage(error.message || null)
//           return
//         }
//
//         if (
//           (paymentIntent && paymentIntent.status === "requires_capture") ||
//           paymentIntent.status === "succeeded"
//         ) {
//           return onPaymentCompleted()
//         }
//
//         return
//       })
//   }
//
//   return (
//     <>
//       <button
//         disabled={disabled || notReady || submitting}
//         onClick={handlePayment}
//         className="px-6 py-3 bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
//         data-testid={dataTestId}
//       >
//         {submitting ? "Loading..." : "Ολοκλήρωση"}
//       </button>
//       <ErrorMessage
//         error={errorMessage}
//         data-testid="stripe-payment-error-message"
//       />
//     </>
//   )
// }
//
// // ─── PayPal ───────────────────────────────────────────────────────────────────
//
// const PayPalPaymentButton = ({
//   cart,
//   notReady,
//   disabled,
//   orderNote = "",
//   "data-testid": dataTestId,
// }: {
//   cart: HttpTypes.StoreCart
//   notReady: boolean
//   disabled?: boolean
//   orderNote?: string
//   "data-testid"?: string
// }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//
//   const paymentSession = cart.payment_collection?.payment_sessions?.find(
//     (session) => session.status === "pending"
//   )
//
//   const paymentCollectionId = cart.payment_collection?.id
//   const orderId = paymentSession?.data?.id as string | undefined
//
//   const handleApprove = async () => {
//     setSubmitting(true)
//
//     try {
//       if (!paymentCollectionId || !paymentSession?.id) {
//         throw new Error("PayPal payment session is missing.")
//       }
//
//       await authorizePaymentSession({
//         paymentCollectionId,
//         paymentSessionId: paymentSession.id,
//       })
//
//       if (orderNote.trim()) {
//         await updateCartMetadata({ message: orderNote.trim() })
//       }
//
//       await placeOrder()
//     } catch (err: any) {
//       setErrorMessage(err?.message || "PayPal payment failed.")
//       setSubmitting(false)
//     }
//   }
//
//   if (!paymentSession || !orderId) {
//     return (
//       <>
//         <button
//           disabled
//           className="w-full bg-oceanBlue rounded-[4px] px-4 py-2.5 sm:py-3 text-center text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//           data-testid={dataTestId}
//         >
//           PayPal is not ready
//         </button>
//         <ErrorMessage
//           error={errorMessage}
//           data-testid="paypal-payment-error-message"
//         />
//       </>
//     )
//   }
//
//   return (
//     <>
//       <div className="w-full" data-testid={dataTestId}>
//         <PayPalButtons
//           forceReRender={[orderId, disabled, notReady]}
//           disabled={notReady || disabled || submitting}
//           style={{ layout: "vertical", shape: "rect" }}
//           createOrder={async () => {
//             if (!orderId) {
//               setErrorMessage("PayPal order ID is missing.")
//               throw new Error("Missing PayPal order ID")
//             }
//             return orderId
//           }}
//           onApprove={handleApprove}
//           onError={(error: unknown) => {
//             const message =
//               error instanceof Error ? error.message : "PayPal payment failed."
//             setErrorMessage(message)
//             setSubmitting(false)
//           }}
//           onCancel={() => setSubmitting(false)}
//         />
//       </div>
//       <ErrorMessage
//         error={errorMessage}
//         data-testid="paypal-payment-error-message"
//       />
//     </>
//   )
// }
//
// const ManualTestPaymentButton = ({
//   notReady,
//   "data-testid": dataTestId,
//   disabled = false,
// }: {
//   notReady: boolean
//   "data-testid"?: string
//   disabled?: boolean
// }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//
//   const onPaymentCompleted = async () => {
//     await placeOrder()
//       .catch((err) => {
//         setErrorMessage(err.message)
//       })
//       .finally(() => {
//         setSubmitting(false)
//       })
//   }
//
//   const handlePayment = () => {
//     setSubmitting(true)
//
//     onPaymentCompleted()
//   }
//
//   return (
//     <>
//       <button
//         disabled={notReady || submitting || disabled}
//         onClick={handlePayment}
//         className="px-6 py-3 bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
//         data-testid={dataTestId || "submit-order-button"}
//       >
//         {submitting ? "Loading..." : "Ολοκλήρωση"}
//       </button>
//       <ErrorMessage
//         error={errorMessage}
//         data-testid="manual-payment-error-message"
//       />
//     </>
//   )
// }
//
// const CashOnDeliveryPaymentButton = ({
//   notReady,
//   "data-testid": dataTestId,
//   disabled = false,
// }: {
//   notReady: boolean
//   "data-testid"?: string
//   disabled?: boolean
// }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//
//   const onPaymentCompleted = async () => {
//     await placeOrder()
//       .catch((err) => {
//         setErrorMessage(err.message)
//       })
//       .finally(() => {
//         setSubmitting(false)
//       })
//   }
//
//   const handlePayment = () => {
//     setSubmitting(true)
//
//     onPaymentCompleted()
//   }
//
//   return (
//     <>
//       <button
//         disabled={notReady || submitting || disabled}
//         onClick={handlePayment}
//         className="px-6 py-3 bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
//         data-testid={dataTestId || "submit-order-button"}
//       >
//         {submitting ? "Loading..." : "Ολοκλήρωση"}
//       </button>
//       <ErrorMessage
//         error={errorMessage}
//         data-testid="manual-payment-error-message"
//       />
//     </>
//   )
// }
//
// const PayInStorePaymentButton = ({
//   notReady,
//   disabled,
//   orderNote = "",
//   "data-testid": dataTestId,
// }: {
//   notReady: boolean
//   disabled?: boolean
//   orderNote?: string
//   "data-testid"?: string
// }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//
//   const onPaymentCompleted = async () => {
//     if (orderNote.trim()) {
//       await updateCartMetadata({ message: orderNote.trim() })
//     }
//     await placeOrder()
//       .catch((err) => setErrorMessage(err.message))
//       .finally(() => setSubmitting(false))
//   }
//
//   const handlePayment = () => {
//     setSubmitting(true)
//     onPaymentCompleted()
//   }
//
//   return (
//     <>
//       <button
//         disabled={notReady || submitting || disabled}
//         onClick={handlePayment}
//         className="w-full bg-oceanBlue rounded-[4px] px-4 py-2.5 sm:py-3 text-center text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//         data-testid={dataTestId || "submit-order-button"}
//       >
//         {submitting ? "Φόρτωση..." : "ΟΛΟΚΛΗΡΩΣΗ ΠΑΡΑΓΓΕΛΙΑΣ"}
//       </button>
//       <ErrorMessage
//         error={errorMessage}
//         data-testid="manual-payment-error-message"
//       />
//     </>
//   )
// }
//
// const BankTransferPaymentButton = ({
//   notReady,
//   disabled,
//   orderNote = "",
//   "data-testid": dataTestId,
// }: {
//   notReady: boolean
//   disabled?: boolean
//   orderNote?: string
//   "data-testid"?: string
// }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//
//   const onPaymentCompleted = async () => {
//     if (orderNote.trim()) {
//       await updateCartMetadata({ message: orderNote.trim() })
//     }
//     await placeOrder()
//       .catch((err) => setErrorMessage(err.message))
//       .finally(() => setSubmitting(false))
//   }
//
//   const handlePayment = () => {
//     setSubmitting(true)
//     onPaymentCompleted()
//   }
//
//   return (
//     <>
//       <button
//         disabled={notReady || submitting || disabled}
//         onClick={handlePayment}
//         className="w-full bg-oceanBlue rounded-[4px] px-4 py-2.5 sm:py-3 text-center text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//         data-testid={dataTestId || "submit-order-button"}
//       >
//         {submitting ? "Φόρτωση..." : "ΟΛΟΚΛΗΡΩΣΗ ΠΑΡΑΓΓΕΛΙΑΣ"}
//       </button>
//       <ErrorMessage
//         error={errorMessage}
//         data-testid="manual-payment-error-message"
//       />
//     </>
//   )
// }
//
// export default PaymentButton
