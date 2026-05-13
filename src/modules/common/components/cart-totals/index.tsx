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
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
    items?: HttpTypes.StoreCartLineItem[] | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const t = useTranslations()
  const {
    currency_code,
    total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
    items,
  } = totals

  const itemCount = items?.reduce((acc, i) => acc + i.quantity, 0) ?? 0
  const itemLabel = itemCount === 1 ? `1 ${t("common.item")}` : `${itemCount} ${t("common.items")}`

  // Distinguish "not yet calculated" from "free"
  const hasShipping =
    shipping_subtotal !== null && shipping_subtotal !== undefined
  const isShippingFree = hasShipping && shipping_subtotal === 0

  return (
    <div className="rounded-md">
      <div className="flex flex-col gap-y-3 text-sm text-[#5a5a3a]">
        <div className="flex items-center justify-between">
          <span className="text-[18px] text-primary">{itemLabel}</span>
          <span
            data-testid="cart-subtotal"
            data-value={item_subtotal ?? 0}
            className="text-[18px] text-primary2"
          >
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[18px] text-primary">{t("cart.shipping")}</span>
          <span
            data-testid="cart-shipping"
            data-value={shipping_subtotal ?? 0}
            className="text-[18px] text-primary2"
          >
            {!hasShipping
              ? "—"
              : isShippingFree
              ? t("common.free")
              : convertToLocale({
                  amount: shipping_subtotal ?? 0,
                  currency_code,
                })}
          </span>
        </div>

        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span className="text-[18px] text-primary">{t("cart.discount")}</span>
            <span
              className="text-[18px] text-primary2"
              data-testid="cart-discount"
              data-value={discount_subtotal}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal,
                currency_code,
              })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pb-4">
          <span className="text-[18px] text-primary">{t("cart.totalWithTax")}</span>
          <span
            data-testid="cart-total"
            data-value={total ?? 0}
            className="text-[18px] text-primary2"
          >
            {convertToLocale({ amount: total ?? 0, currency_code })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartTotals
