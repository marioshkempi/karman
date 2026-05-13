"use client"

import React from "react"

type ProductFlagsProps = {
  isOutOfStock: any
  isNewProduct: boolean
  cubikPrice?: any
}

const ProductFlags: React.FC<ProductFlagsProps> = ({
  isOutOfStock,
  isNewProduct,
  cubikPrice,
}) => {
  const rule = cubikPrice?.price ? cubikPrice.price : cubikPrice

  const hasSale =
    rule?.discount_applies &&
    rule?.value &&
    (rule?.type === "percent" ||
      rule?.type === "fixed" ||
      rule?.type === "amount")

  const percent =
    rule?.type === "percent" && rule?.value
      ? parseFloat(String(rule.value))
      : null

  if (isOutOfStock) {
    return (
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-secondary text-white text-xs font-medium px-3 py-1.5 rounded">
          Χωρίς Απόθεμα
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
      {hasSale && (
        <div className="bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-full animate-[fadeIn_0.25s_ease-out]">
          {percent !== null && percent !== 0 && (
            <span className="opacity-90">-{percent}%</span>
          )}
        </div>
      )}

      {isNewProduct && (
        <div className="bg-tertiary text-white text-xs font-medium px-3 py-1.5 rounded-full animate-[fadeIn_0.25s_ease-out] text-center">
          NEW
        </div>
      )}
    </div>
  )
}

export default ProductFlags
