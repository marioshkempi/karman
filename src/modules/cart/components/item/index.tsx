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
import { Plus, Minus } from "lucide-react"
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
        "border-2 border-primary p-3 sm:p-4 relative",
        !isFirst && "border-t"
      )}
      data-testid="product-row"
    >
      {updating && (
        <div className="absolute inset-0 z-50 bg-white/70 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <DeleteButton
        id={item.id}
        className="absolute top-2 right-2"
        data-testid="product-delete-button"
      />

      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="flex-shrink-0">
          <LocalizedClientLink
            href={`/${item.product_handle}`}
            className="block"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded overflow-hidden">
              <Thumbnail
                thumbnail={item.thumbnail}
                images={item.variant?.product?.images}
                size="square"
                className="w-full h-full object-contain"
              />
            </div>
          </LocalizedClientLink>
        </div>

        <div className="flex-grow min-w-0 pr-6">
          <LocalizedClientLink
            href={`/${item.product_handle}`}
            className="block mb-2 max-w-[90%]"
          >
            <h3
              className="text-primary text-sm sm:text-base font-normal leading-snug hover:opacity-80 line-clamp-2"
              data-testid="product-title"
            >
              {item.product_title}
              {item.variant?.title != "Default variant" &&
                item.variant?.title &&
                ` - ${item.variant.title}`}
            </h3>
          </LocalizedClientLink>

          <div className="text-lg sm:text-xl text-primary font-bold mb-3">
            {hasReducedUnitPrice && (
              <>
                <span
                  className="line-through text-ui-fg-muted text-sm mr-2"
                  data-testid="product-unit-original-price"
                >
                  {convertToLocale({
                    // @ts-ignore
                    amount: original_total / item.quantity,
                    currency_code: currencyCode,
                  })}
                </span>
                <span className="text-ui-fg-interactive text-sm mr-2">
                  -{unitPricePercentageDiff}%
                </span>
              </>
            )}
            <span
              className={clx({
                "text-ui-fg-interactive": hasReducedUnitPrice,
              })}
              data-testid="product-unit-price"
            >
              {convertToLocale({
                // @ts-ignore
                amount: total / item.quantity,
                currency_code: currencyCode,
              })}
            </span>
          </div>

          {type === "full" && (
            <>
              <div className="flex items-center">
                <div className="flex items-center border border-primary2 rounded-base shadow-sm overflow-hidden bg-white">
                  <button
                    onClick={decrementQuantity}
                    disabled={updating || item.quantity <= 1}
                    className={clx(
                      "w-8 h-8 flex items-center justify-center bg-white text-secondary hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0",
                      (updating || item.quantity <= 1) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    data-testid="product-decrease-button"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[2]" />
                  </button>

                  <div className="flex items-center justify-center w-10 h-8 flex-shrink-0">
                    <span className="font-semibold text-sm text-secondary">
                      {item.quantity}
                    </span>
                  </div>

                  <button
                    onClick={incrementQuantity}
                    disabled={
                      updating || item.quantity >= Math.min(maxQuantity, 10)
                    }
                    className={clx(
                      "w-8 h-8 flex items-center justify-center bg-white text-secondary hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex-shrink-0",
                      (updating ||
                        item.quantity >= Math.min(maxQuantity, 10)) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    data-testid="product-increase-button"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>
              </div>

              <ErrorMessage error={error} data-testid="product-error-message" />
            </>
          )}

          {type === "preview" && (
            <div className="flex gap-x-1 text-ui-fg-muted">
              <span>{item.quantity}x </span>
              <span
                className={clx("text-sm", {
                  "text-ui-fg-interactive": hasReducedUnitPrice,
                })}
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

          {hasReducedPrice && (
            <div className="mt-2">
              {type === "default" && (
                <span className="text-ui-fg-subtle text-sm">Original: </span>
              )}
              <span
                className="line-through text-ui-fg-muted text-sm"
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalPrice,
                  currency_code: currencyCode,
                })}
              </span>
              {type === "default" && (
                <span className="text-ui-fg-interactive text-sm ml-2">
                  -{getPercentageDiff(originalPrice, currentPrice || 0)}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Item
