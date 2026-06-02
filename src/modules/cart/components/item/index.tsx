"use client"

import { clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { convertToLocale } from "@lib/util/money"
import { Plus, Minus, Trash2 } from "lucide-react"
import Spinner from "@modules/common/components/loading-spinner/Spinner"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview" | "default"
  currencyCode: string
  isFirst?: boolean
}

const Item = ({
  item,
  type = "full",
  currencyCode,
  isFirst = false,
}: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  const incrementQuantity = () => {
    if (item.quantity < Math.min(maxQuantity, 10)) {
      changeQuantity(item.quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      changeQuantity(item.quantity - 1)
    }
  }

  const { total, original_total } = item
  const originalPrice: any = original_total
  const currentPrice = total
  // @ts-ignore
  const hasReducedPrice = currentPrice < originalPrice
  // @ts-ignore
  const hasReducedUnitPrice = total < original_total
  // @ts-ignore
  const unitPricePercentageDiff = Math.round(
    // @ts-ignore
    ((original_total - total) / original_total) * 100
  )

  return (
    <div
      className={clx(
        "p-4 relative",
        !isFirst && "border-t border-gray-200"
      )}
      data-testid="product-row"
    >
      {updating && (
        <div className="absolute inset-0 z-50 bg-white/70 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="flex gap-4 items-start">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <LocalizedClientLink
            href={`/${item.product_handle}`}
            className="block"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden border border-gray-100">
              <Thumbnail
                thumbnail={item.thumbnail}
                images={item.variant?.product?.images}
                size="square"
                className="w-full h-full object-contain"
              />
            </div>
          </LocalizedClientLink>
        </div>

        {/* Product Info */}
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start gap-2">
            <LocalizedClientLink
              href={`/${item.product_handle}`}
              className="block flex-1"
            >
              <h3
                className="text-[#1E3A5F] text-sm sm:text-base font-medium leading-snug hover:opacity-80 line-clamp-2"
                data-testid="product-title"
              >
                {item.product_title}
                {item.variant?.title != "Default variant" &&
                  item.variant?.title &&
                  ` - ${item.variant.title}`}
              </h3>
            </LocalizedClientLink>

            {/* Delete Button */}
            <DeleteButton
              id={item.id}
              className="flex-shrink-0 text-red-500 hover:text-red-600"
              data-testid="product-delete-button"
            >
              <Trash2 className="w-5 h-5" />
            </DeleteButton>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            {hasReducedUnitPrice && (
              <span
                className="line-through text-gray-400 text-sm"
                data-testid="product-unit-original-price"
              >
                {convertToLocale({
                  // @ts-ignore
                  amount: original_total / item.quantity,
                  currency_code: currencyCode,
                })}
              </span>
            )}
            <span
              className="text-[#007BFF] text-lg font-bold"
              data-testid="product-unit-price"
            >
              {convertToLocale({
                // @ts-ignore
                amount: total / item.quantity,
                currency_code: currencyCode,
              })}
            </span>
          </div>

          {/* Quantity Stepper */}
          {type === "full" && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center border border-[#007BFF] rounded-full overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  disabled={updating || item.quantity <= 1}
                  className={clx(
                    "w-8 h-8 flex items-center justify-center text-[#007BFF] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                    (updating || item.quantity <= 1) && "opacity-50 cursor-not-allowed"
                  )}
                  data-testid="product-decrease-button"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="w-8 h-8 flex items-center justify-center">
                  <span className="font-medium text-[#1E3A5F]">
                    {item.quantity}
                  </span>
                </div>

                <button
                  onClick={incrementQuantity}
                  disabled={updating || item.quantity >= Math.min(maxQuantity, 10)}
                  className={clx(
                    "w-8 h-8 flex items-center justify-center text-[#007BFF] hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                    (updating || item.quantity >= Math.min(maxQuantity, 10)) && "opacity-50 cursor-not-allowed"
                  )}
                  data-testid="product-increase-button"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {type === "preview" && (
            <div className="flex gap-x-1 text-gray-500 mt-1">
              <span>{item.quantity}x </span>
              <span
                className="text-sm text-[#007BFF]"
                data-testid="product-unit-price"
              >
                {convertToLocale({
                  // @ts-ignore
                  amount: total / item.quantity,
                  currency_code: currencyCode,
                })}
              </span>
            </div>
          )}

          <ErrorMessage error={error} data-testid="product-error-message" />
        </div>
      </div>
    </div>
  )
}

export default Item
