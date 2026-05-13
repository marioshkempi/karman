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
    <div className="flex flex-col text-ui-fg-base text-center">
      <div className={clx("flex items-center justify-center gap-3", className)}>
        <span
          className={clx(
            "font-sans txt-medium text-black text-[16px] lg:text-[18px] font-semibold transition-all duration-300",
            { "scale-[1.03]": cubikApplied },
            priceClassName
          )}
          data-testid="product-price"
        >
          {finalFormatted}
        </span>

        {showOriginal && (
          <span
            className={clx(
              "line-through opacity-60 font-sans txt-medium text-black text-[10px] lg:text-[16px] font-semibold transition-all duration-300 animate-[fadeIn_0.25s_ease-out]",
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
