"use client"

import {
  isPaypal,
  isStripe as isStripeFunc,
  paymentInfoMap,
} from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import CheckCircleSolid from "@modules/common/icons/check-circle-solid"
import { Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import BankTransferContainer, {
  isBankTransfer,
  isBankTransferSub,
  isBankTransferParent,
} from "@modules/checkout/components/bank-transfer-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {
  applyPaymentFee,
  removePaymentFee,
  type PaymentFee,
} from "@lib/data/payment-fee"
import ErrorBanner from "@modules/checkout/components/payment-error"
import { useTranslations } from "next-intl"

function formatMoney(amount: number, currency: string = "eur"): string {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

const RadioGroup = ({
  children,
}: {
  value: string | null | undefined
  onChange: (value: string) => void
  children: React.ReactNode
}) => {
  return <div role="radiogroup">{children}</div>
}

const CustomRadio = ({
  checked,
  "data-testid": dataTestId,
}: {
  checked: boolean
  "data-testid"?: string
}) => {
  return (
    <div
      className="relative flex h-5 w-5 items-center justify-center"
      data-testid={dataTestId || "radio-button"}
    >
      <div
        className={clx(
          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
          {
            "border-primary bg-primary": checked,
            "border-gray-300 bg-transparent": !checked,
          }
        )}
      >
        {checked && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
      </div>
    </div>
  )
}

const FeeBadge = ({
  feeAmount,
  feeLabel,
  currencyCode,
}: {
  feeAmount: number
  feeLabel: string
  currencyCode: string
}) => {
  if (feeAmount <= 0) return null

  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200 whitespace-nowrap ml-2">
      +{formatMoney(feeAmount, currencyCode)} {feeLabel.toLowerCase()}
    </span>
  )
}

type EnrichedPaymentProvider = {
  id: string
  display_name: string | null
  description: string | null
  image_url: string | null
  extra_content: string | null
}

const Payment = ({
  cart,
  availablePaymentMethods,
  paymentFees = [],
}: {
  cart: any
  availablePaymentMethods: EnrichedPaymentProvider[]
  paymentFees: PaymentFee[]
}) => {
  const activeSession =
    cart.payment_collection?.payment_sessions?.find(
      (s: any) => s.status === "pending"
    ) ??
    cart.payment_collection?.payment_sessions?.[
      cart.payment_collection.payment_sessions.length - 1
    ]

  const initialProvider =
    activeSession?.provider_id ?? cart?.metadata?.payment_fee?.provider_id ?? ""

  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitiating, setIsInitiating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState(initialProvider)

  // ─── Bank transfer grouping ─────────────────────────────────────
  const bankTransferParent =
    availablePaymentMethods.find((p) => isBankTransferParent(p.id)) ?? null

  const bankTransferSubs = availablePaymentMethods.filter((p) =>
    isBankTransferSub(p.id)
  )

  const regularProviders = availablePaymentMethods.filter(
    (p) => !isBankTransfer(p.id)
  )

  const hasBankTransfers = !!bankTransferParent

  const [selectedBankId, setSelectedBankId] = useState<string>(() => {
    if (initialProvider && isBankTransferSub(initialProvider)) {
      return initialProvider
    }
    if (bankTransferSubs.length > 0) {
      return bankTransferSubs[0].id
    }
    return bankTransferParent?.id ?? ""
  })

  // ─── Sync from session/metadata ─────────────────────────────────
  useEffect(() => {
    const sessionProvider = activeSession?.provider_id
    const metadataProvider = cart?.metadata?.payment_fee?.provider_id

    if (sessionProvider && sessionProvider !== selectedPaymentMethod) {
      setSelectedPaymentMethod(sessionProvider)
      if (isBankTransfer(sessionProvider)) {
        setSelectedBankId(sessionProvider)
      }
    } else if (
      !sessionProvider &&
      metadataProvider &&
      metadataProvider !== selectedPaymentMethod &&
      !selectedPaymentMethod
    ) {
      setSelectedPaymentMethod(metadataProvider)
      if (isBankTransfer(metadataProvider)) {
        setSelectedBankId(metadataProvider)
      }
    }
  }, [activeSession?.provider_id, cart?.metadata?.payment_fee?.provider_id])

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"
  const isStripe = isStripeFunc(selectedPaymentMethod)

  // ─── Payment fees ───────────────────────────────────────────────
  const getFeeForProvider = useCallback(
    (providerId: string) =>
      paymentFees.find((f) => f.provider_id === providerId),
    [paymentFees]
  )

  // ─── Session helpers ────────────────────────────────────────────
  // const buildPaypalSessionData = () => ({
  //   items: cart?.items ?? [],
  //   shipping_info: cart?.shipping_address ?? undefined,
  //   email: cart?.email ?? undefined,
  // })
  const buildPaypalSessionData = () => {
    const paymentFee = cart?.metadata?.payment_fee?.amount ?? 0

    return {
      items: cart?.items ?? [],
      shipping_info: cart?.shipping_address ?? undefined,
      email: cart?.email ?? undefined,
      shipping_total: cart?.shipping_total ?? 0,
      tax_total: cart?.tax_total ?? 0,
      discount_total: cart?.discount_total ?? 0,
      payment_fee: paymentFee,
      item_total: cart?.item_total ?? cart?.subtotal ?? 0,
      total: cart?.total ?? 0,
      currency_code: cart?.currency_code ?? "eur",
    }
  }

  const initiateSession = async (providerId: string) => {
    if (activeSession?.provider_id === providerId) return

    const sessionPayload = isPaypal(providerId)
      ? { provider_id: providerId, data: buildPaypalSessionData() }
      : { provider_id: providerId, data: { cart } }

    await initiatePaymentSession(cart, sessionPayload)

    if (cart?.id) {
      const fee = getFeeForProvider(providerId)
      if (fee && fee.fee_amount > 0) {
        await applyPaymentFee(
          cart.id,
          providerId,
          fee.fee_amount,
          fee.fee_label
        )
      } else {
        await removePaymentFee(cart.id)
      }
    }
    await initiatePaymentSession(cart, sessionPayload)
  }

  // ─── Payment method selection ───────────────────────────────────
  const setPaymentMethod = async (method: string) => {
    if (method === selectedPaymentMethod) return

    setError(null)
    setSelectedPaymentMethod(method)
    setIsInitiating(true)

    try {
      await initiateSession(method)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsInitiating(false)
    }
  }

  const handleBankTransferGroupSelect = () => {
    if (isBankTransfer(selectedPaymentMethod)) return

    const bankId =
      selectedBankId || bankTransferSubs[0]?.id || bankTransferParent?.id || ""

    if (bankId) {
      setSelectedBankId(bankId)
      setPaymentMethod(bankId)
    }
  }

  const handleBankChange = (providerId: string) => {
    setSelectedBankId(providerId)
    setPaymentMethod(providerId)
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  // ─── Navigation helpers ─────────────────────────────────────────
  const getPathWithoutCountryCode = () => {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length > 1 && parts[0] && parts[0].length === 2) {
      return "/" + parts.slice(1).join("/")
    }
    return pathname
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(
      getPathWithoutCountryCode() + "?" + createQueryString("step", "payment"),
      { scroll: false }
    )
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      if (
        isBankTransfer(selectedPaymentMethod) &&
        bankTransferSubs.length > 0 &&
        !isBankTransferSub(selectedBankId)
      ) {
        setError(t("checkout.selectBank"))
        setIsLoading(false)
        return
      }

      const sessionPayload = isPaypal(selectedPaymentMethod)
        ? {
            provider_id: selectedPaymentMethod,
            data: buildPaypalSessionData(),
          }
        : { provider_id: selectedPaymentMethod, data: { cart } }

      await initiatePaymentSession(cart, sessionPayload)

      if (cart?.id) {
        const fee = getFeeForProvider(selectedPaymentMethod)
        if (fee && fee.fee_amount > 0) {
          await applyPaymentFee(
            cart.id,
            selectedPaymentMethod,
            fee.fee_amount,
            fee.fee_label
          )
        } else {
          await removePaymentFee(cart.id)
        }
      }

      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      if (!shouldInputCard) {
        return router.push(
          getPathWithoutCountryCode() +
            "?" +
            createQueryString("step", "review"),
          { scroll: false }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const renderFeeBadge = (fee: PaymentFee | undefined) => {
    if (!fee || fee.fee_amount <= 0) return null
    return (
      <FeeBadge
        feeAmount={fee.fee_amount}
        feeLabel={fee.fee_label}
        currencyCode={cart?.currency_code ?? "eur"}
      />
    )
  }

  return (
    <div className="bg-white">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-row items-center justify-between mb-4 lg:mb-6">
        <h2 className="flex flex-row text-[16px] lg:text-[20px] gap-x-2 items-center text-black font-bold">
          {!isOpen && paymentReady && (
            <CheckCircleSolid className=" w-4 h-4 lg:w-5 lg:h-5 text-primary" />
          )}
          {t("checkout.payment")}
        </h2>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-black text-[14px] lg:text-base hover:opacity-80"
              data-testid="edit-payment-button"
            >
              {t("common.edit")}
            </button>
          </Text>
        )}
      </div>

      <ErrorBanner />

      {/* ── Body ────────────────────────────────────────────────── */}
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && !!availablePaymentMethods?.length && (
            <RadioGroup
              value={selectedPaymentMethod}
              onChange={(value: string) => setPaymentMethod(value)}
            >
              {/* ── Regular providers ────────────────────────── */}
              {regularProviders.map((paymentMethod) => {
                const fee = getFeeForProvider(paymentMethod.id)
                const feeBadge = renderFeeBadge(fee)

                const sharedProps = {
                  paymentInfoMap,
                  paymentProviderId: paymentMethod.id,
                  selectedPaymentOptionId: selectedPaymentMethod,
                  displayName: paymentMethod.display_name,
                  imageUrl: paymentMethod.image_url,
                  description: paymentMethod.description,
                  extraContent: paymentMethod.extra_content,
                  CustomRadio,
                  onClick: () => setPaymentMethod(paymentMethod.id),
                  feeBadge,
                  feeBreakdown: null,
                }

                return (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        {...sharedProps}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer {...sharedProps} />
                    )}
                  </div>
                )
              })}

              {/* ── Bank Transfer group ──────────────────────── */}
              {hasBankTransfers && (
                <BankTransferContainer
                  parentProvider={bankTransferParent}
                  subProviders={bankTransferSubs}
                  selectedPaymentOptionId={selectedPaymentMethod}
                  selectedBankId={selectedBankId}
                  onGroupSelect={handleBankTransferGroupSelect}
                  onBankChange={handleBankChange}
                  paymentInfoMap={paymentInfoMap}
                  CustomRadio={CustomRadio}
                  feeBadge={
                    selectedBankId
                      ? renderFeeBadge(getFeeForProvider(selectedBankId))
                      : null
                  }
                />
              )}
            </RadioGroup>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-black mb-1 font-black">
                {t("checkout.paymentMethodLabel")}
              </Text>
              <Text
                className="txt-medium text-black"
                data-testid="payment-method-summary"
              >
                {t("checkout.giftCard")}
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              isInitiating ||
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            className="mt-6 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#FF8C00] rounded text-white text-[14px] sm:text-base font-medium hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            data-testid="submit-payment-button"
          >
            {isLoading || isInitiating
              ? t("common.loading")
              : !activeSession && isStripeFunc(selectedPaymentMethod)
              ? t("checkout.enterCardDetails")
              : t("common.continue")}
          </button>
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
