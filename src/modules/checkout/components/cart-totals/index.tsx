"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import React from "react"
import { useTranslations } from "next-intl"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_tax_total?: number | null
    item_tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
    gift_card_total?: number | null
    metadata?: Record<string, any> | null
    items?: HttpTypes.StoreCartLineItem[] | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const t = useTranslations()
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
    gift_card_total,
    metadata,
    items,
  } = totals

  const itemCount = items?.reduce((acc, i) => acc + i.quantity, 0) ?? 0
  const itemLabel = itemCount === 1 ? `1 ${t("common.item")}` : `${itemCount} ${t("common.items")}`

  // Distinguish "not yet calculated" from "free"
  const hasShipping =
    shipping_subtotal !== null && shipping_subtotal !== undefined
  const isShippingFree = hasShipping && Number(shipping_subtotal) === 0

  // Payment fee from cart metadata
  const paymentFee = metadata?.payment_fee
  const feeAmount =
    paymentFee && !paymentFee.removed && Number(paymentFee.fee_amount) > 0
      ? Number(paymentFee.fee_amount)
      : 0
  const feeLabel = paymentFee?.fee_label ?? t("cart.paymentFee")

  // VAT — Medusa totals in EU regions are tax-inclusive by default, so
  // this line is informational ("of which X is VAT"), not an additional charge.
  const vatAmount = Number(tax_total ?? 0)
  const giftCardAmount = Number(gift_card_total ?? 0)

  const displayTotal = (total ?? 0) + feeAmount

  return (
    <div className="rounded-md py-4">
      <div className="flex flex-col gap-y-3 text-sm text-[#5a5a3a]">
        {/* Items subtotal */}
        <Row
          label={itemLabel}
          testId="cart-subtotal"
          value={item_subtotal ?? 0}
        >
          {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
        </Row>

        {/* Shipping */}
        <Row
          label={t("cart.shipping")}
          testId="cart-shipping"
          value={shipping_subtotal ?? 0}
        >
          {!hasShipping
            ? "—"
            : isShippingFree
            ? t("common.free")
            : convertToLocale({
                amount: Number(shipping_subtotal) || 0,
                currency_code,
              })}
        </Row>

        {/* Discount */}
        {!!discount_subtotal && (
          <Row
            label={t("cart.discount")}
            testId="cart-discount"
            value={discount_subtotal}
            valueClassName="text-rose-700"
          >
            −{" "}
            {convertToLocale({
              amount: discount_subtotal,
              currency_code,
            })}
          </Row>
        )}

        {/* Gift card */}
        {!!giftCardAmount && (
          <Row
            label={t("cart.giftCard")}
            testId="cart-gift-card"
            value={giftCardAmount}
            valueClassName="text-rose-700"
          >
            − {convertToLocale({ amount: giftCardAmount, currency_code })}
          </Row>
        )}

        {/* Payment fee */}
        {feeAmount > 0 && (
          <Row label={feeLabel} testId="cart-payment-fee" value={feeAmount}>
            + {convertToLocale({ amount: feeAmount, currency_code })}
          </Row>
        )}

        {/* VAT (informational — already included in line prices for EU) */}
        {vatAmount > 0 && (
          <Row
            label={t("cart.vat")}
            testId="cart-tax-total"
            value={vatAmount}
            labelClassName="text-sm text-[#5a5a3a] "
            valueClassName="text-sm text-[#5a5a3a] "
          >
            {convertToLocale({ amount: vatAmount, currency_code })}
          </Row>
        )}

        {/* Separator */}
        <div className="border-t border-primary/20 pt-3" />

        {/* Grand total */}
        <div className="flex items-center justify-between pb-2">
          <span className="text-[16px] text-secondary font-bold">
            {t("cart.totalWithVat")}
          </span>
          <span
            data-testid="cart-total"
            data-value={displayTotal}
            className="text-[18px] font-bold text-secondary"
          >
            {convertToLocale({ amount: displayTotal, currency_code })}
          </span>
        </div>
      </div>
    </div>
  )
}

// Small helper to keep the JSX above readable
type RowProps = {
  label: string
  testId: string
  value: number
  children: React.ReactNode
  labelClassName?: string
  valueClassName?: string
}

const Row: React.FC<RowProps> = ({
  label,
  testId,
  value,
  children,
  labelClassName = "text-[16px] text-secondary",
  valueClassName = "text-[16px] text-secondary",
}) => (
  <div className="flex items-center justify-between">
    <span className={"text-[16px] text-secondary"}>{label}</span>
    <span
      data-testid={testId}
      data-value={value}
      className={"text-[16px] text-secondary"}
    >
      {children}
    </span>
  </div>
)

export default CartTotals
