import { Text, clx } from "@medusajs/ui"
import React, { useContext, useMemo, type JSX } from "react"

import { isManual } from "@lib/constants"
import { useTranslations } from "next-intl"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  displayName?: string | null
  imageUrl?: string | null
  description?: string | null
  extraContent?: string | null
  children?: React.ReactNode
  CustomRadio?: React.ComponentType<{
    checked: boolean
    "data-testid"?: string
  }>
  onClick?: () => void
  feeBadge?: React.ReactNode
  feeBreakdown?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  displayName,
  imageUrl,
  description,
  extraContent,
  children,
  CustomRadio,
  onClick,
  feeBadge,
  feeBreakdown,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const checked = selectedPaymentOptionId === paymentProviderId
  const RadioComponent = CustomRadio || (() => null)

  const fallback = paymentInfoMap[paymentProviderId]
  const resolvedTitle = displayName || fallback?.title || paymentProviderId
  const resolvedIcon = fallback?.icon ?? null

  return (
    <div
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={clx(
        "flex flex-col gap-y-2 text-small-regular py-4 border border-secondary rounded-rounded px-8 mb-2 transition-opacity",
        {
          "border-primary bg-primary/[0.03]": checked,
          "cursor-pointer hover:opacity-80": !disabled,
          "cursor-not-allowed opacity-50": disabled,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <RadioComponent checked={checked} />
          <Text className="text-base-regular text-secondary">
            {resolvedTitle}
          </Text>
          {feeBadge}
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <span className="justify-self-end text-secondary">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={resolvedTitle}
              className="h-8 w-auto max-w-[80px] object-contain"
            />
          ) : (
            resolvedIcon
          )}
        </span>
      </div>

      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}

      {checked && feeBreakdown}

      {checked && extraContent && (
        <div
          className="text-[13px] text-gray-600 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0"
          dangerouslySetInnerHTML={{ __html: extraContent }}
        />
      )}

      {children}
    </div>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  displayName,
  imageUrl,
  description,
  extraContent,
  setCardBrand,
  setError,
  setCardComplete,
  CustomRadio,
  onClick,
  feeBadge,
  feeBreakdown,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const t = useTranslations()
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
      displayName={displayName}
      imageUrl={imageUrl}
      description={description}
      extraContent={extraContent}
      CustomRadio={CustomRadio}
      onClick={onClick}
      feeBadge={feeBadge}
      feeBreakdown={feeBreakdown}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              {t("checkout.enterCardDetails")}
            </Text>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}
