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

  // Distinguish "not yet calculated" from "free"
  const hasShipping =
    shipping_subtotal !== null && shipping_subtotal !== undefined
  const isShippingFree = hasShipping && shipping_subtotal === 0

  return (
    <div className="flex flex-col gap-y-3">
      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <span className="text-[15px] text-gray-600">{t("cart.subtotal")}</span>
        <span
          data-testid="cart-subtotal"
          data-value={item_subtotal ?? 0}
          className="text-[15px] text-gray-900 font-medium"
        >
          {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
        </span>
      </div>

      {/* Discount */}
      {!!discount_subtotal && (
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-gray-600">{t("cart.discount")}</span>
          <span
            className="text-[15px] text-[#F97316] font-medium"
            data-testid="cart-discount"
            data-value={discount_subtotal}
          >
            -{convertToLocale({ amount: discount_subtotal, currency_code })}
          </span>
        </div>
      )}

      {/* Shipping */}
      <div className="flex items-center justify-between">
        <span className="text-[15px] text-gray-600">{t("cart.shippingCost")}</span>
        <span
          data-testid="cart-shipping"
          data-value={shipping_subtotal ?? 0}
          className="text-[15px] text-gray-900 font-medium"
        >
          {!hasShipping
            ? "—"
            : isShippingFree
            ? t("common.free")
            : convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
        </span>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-[18px] text-gray-900 font-bold">{t("cart.total")}</span>
        <span
          data-testid="cart-total"
          data-value={total ?? 0}
          className="text-[22px] text-[#007BFF] font-bold"
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
