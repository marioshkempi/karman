"use client"

import React from "react"

type QuantityDiscount = {
  min_quantity: number
  type: "percent" | "fixed" | "amount"
  value: number
}

type QuantityDiscountBadgesProps = {
  discounts: QuantityDiscount[] | null | undefined
  currentQuantity?: number
}

const QuantityDiscountBadges: React.FC<QuantityDiscountBadgesProps> = ({
  discounts,
  currentQuantity = 1,
}) => {
  if (!discounts || discounts.length === 0) return null

  const sorted = [...discounts].sort((a, b) => a.min_quantity - b.min_quantity)

  const activeIndex = sorted.reduce<number>((acc, d, i) => {
    return currentQuantity >= d.min_quantity ? i : acc
  }, -1)

  return (
    <div className="flex flex-col gap-1.5 mt-2 mb-2">
      {/*<p className="text-[13px] text-gray-500 font-medium">*/}
      {/*  Εκπτώσεις ποσότητας*/}
      {/*</p>*/}
      <div className="flex flex-wrap gap-2">
        {sorted.map((discount, index) => {
          const isActive = index === activeIndex
          const label =
            discount.type === "percent"
              ? `-${discount.value}%`
              : `-${discount.value}€`

          return (
            <div
              key={index}
              className={`
                text-[13px] px-3 py-1.5 rounded-[4px] border transition-all duration-200
                ${
                  isActive
                    ? "bg-primary/10 border-primary text-primary font-semibold"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }
              `}
            >
              <span className="font-medium">{discount.min_quantity}+ τεμ.</span>
              <span className="ml-1.5">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuantityDiscountBadges
