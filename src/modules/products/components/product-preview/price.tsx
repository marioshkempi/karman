"use client"

import { clx } from "@medusajs/ui"
import { applyCubikPriceRule } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"

type Props = {
  originalPrice: number
  currency: string
  cubikPrice?: any | null
  className?: string
  priceClassName?: string
  originalPriceClassName?: string
}

export default function PreviewPrice({
  originalPrice,
  cubikPrice,
  currency,
  className,
  priceClassName,
  originalPriceClassName,
}: Props) {
  if (originalPrice == null) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const { finalPrice, applied: cubikApplied } = applyCubikPriceRule(
    originalPrice,
    cubikPrice ?? null
  )

  const finalPriceNumber = cubikApplied ? finalPrice : originalPrice
  const showOriginal = cubikApplied && finalPriceNumber < originalPrice

  const finalFormatted = convertToLocale({
    currency_code: currency,
    amount: finalPriceNumber,
  })

  const originalFormatted = convertToLocale({
    currency_code: currency,
    amount: originalPrice,
  })

  return (
    <div className="flex flex-col">
      <div className={clx("flex items-center gap-2", className)}>
        <span
          className={clx(
            "font-semibold text-lg",
            showOriginal ? "text-[#059669]" : "text-[#1A2B3C]",
            priceClassName
          )}
          data-testid="product-price"
        >
          {finalFormatted}
        </span>

        {showOriginal && (
          <span
            className={clx(
              "line-through text-[#9CA3AF] text-sm",
              originalPriceClassName
            )}
            data-testid="original-product-price"
          >
            {originalFormatted}
          </span>
        )}
      </div>
    </div>
  )
}
