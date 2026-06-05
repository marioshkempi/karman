import {
  applyCubikPriceRule,
  getProductPrice,
} from "@lib/util/get-product-price"
import { clx } from "@medusajs/ui"
import { formatPrice } from "@lib/util/price-formatter"
import React, { useEffect, useMemo } from "react"

type ProductPriceProps = {
  product: any
  variant?: any
  cubikPrice?: any
  isB2B?: boolean
  onPriceResolved?: (resolved: boolean) => void
  quantity?: number
  quantitySalesData?: any
  erpPricing?: any
}

export default function ProductPrice({
  product,
  variant,
  cubikPrice,
  isB2B,
  onPriceResolved,
  quantity = 1,
  quantitySalesData,
  erpPricing,
}: ProductPriceProps) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  useEffect(() => {
    onPriceResolved?.(!!selectedPrice)
  }, [selectedPrice, onPriceResolved])

  const finalPriceCalculation = useMemo(() => {
    if (!selectedPrice) return null

    const retailBase = selectedPrice.calculated_price_number
    const retailOriginal = selectedPrice.original_price_number

    // Step 1: Apply cubik discount rule
    const {
      finalPrice: cubikAdjustedPrice,
      applied: cubikApplied,
      discountPercent: cubikDiscountPercent,
    } = applyCubikPriceRule(retailOriginal, cubikPrice ?? null)

    let workingPrice = cubikApplied ? cubikAdjustedPrice : retailBase
    let priceBeforeDiscount = cubikApplied ? retailOriginal : retailBase
    let discountPercentage = cubikApplied ? cubikDiscountPercent : 0
    let hasDiscount = cubikApplied && cubikAdjustedPrice < retailOriginal

    // Step 2: Apply ERP pricing on top if available
    if (erpPricing) {
      const rule = erpPricing?.rules?.[0] ?? erpPricing

      if (rule.discount != null && rule.discount > 0) {
        discountPercentage = rule.discount
        workingPrice = workingPrice * (1 - discountPercentage / 100)
        hasDiscount = true
      } else if (rule.price != null && rule.price > 0) {
        workingPrice = rule.price
        if (priceBeforeDiscount > 0) {
          discountPercentage =
            ((priceBeforeDiscount - workingPrice) / priceBeforeDiscount) * 100
        }
        hasDiscount = workingPrice < priceBeforeDiscount
      }
    }

    return {
      finalPrice: workingPrice,
      originalPrice: priceBeforeDiscount,
      retailPrice: retailOriginal,
      discountPercentage: Math.round(discountPercentage * 100) / 100,
      hasDiscount,
      cubikApplied,
      currency: selectedPrice.currency_code,
    }
  }, [selectedPrice, cubikPrice, erpPricing, quantity])

  if (!selectedPrice || !finalPriceCalculation) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-9 w-32 rounded-md price-skeleton" />
      </div>
    )
  }

  const {
    finalPrice,
    originalPrice,
    retailPrice,
    discountPercentage,
    hasDiscount,
    cubikApplied,
    currency,
  } = finalPriceCalculation

  const finalPriceFormatted = formatPrice(finalPrice, currency)
  const originalPriceFormatted = formatPrice(originalPrice, currency)
  const retailPriceFormatted = formatPrice(retailPrice, currency)

  return (
    <div className="flex flex-col text-ui-fg-base animate-price-in">
      <div className="flex items-center gap-3">
        <span
          className={clx(
            "text-3xl font-bold transition-transform duration-300 text-[#16a34a]",
            { "scale-[1.03]": cubikApplied || hasDiscount }
          )}
          data-testid="product-price"
          data-value={finalPrice}
        >
          {finalPriceFormatted}
        </span>
        {hasDiscount && (
          <span
            className="opacity-60 text-base font-medium text-gray-400 line-through !text-[22px]"
            data-testid="original-price"
          >
            {originalPriceFormatted}
          </span>
        )}
      </div>
      {isB2B && <p className="text-gray-600 text-[14px]">χωρίς ΦΠΑ</p>}

      {isB2B && (
        <span className="!text-[14px] mt-0.5 p-0 font-normal">
          Προτεινόμενη τιμή λιανικής: {retailPriceFormatted}
        </span>
      )}
    </div>
  )
}
