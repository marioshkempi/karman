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
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-gray-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
          Χωρίς Απόθεμα
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
      {hasSale && percent !== null && percent !== 0 && (
        <div className="bg-[#FF8C00] text-white text-xs font-semibold px-2.5 py-1 rounded">
          {percent}%
        </div>
      )}

      {isNewProduct && (
        <div className="bg-[#00A676] text-white text-xs font-semibold px-2.5 py-1 rounded">
          NEW
        </div>
      )}
    </div>
  )
}

export default ProductFlags
