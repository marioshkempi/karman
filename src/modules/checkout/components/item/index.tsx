"use client"

import { clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { convertToLocale } from "@lib/util/money"
import DeleteButton from "@modules/common/components/delete-button"
import Spinner from "@modules/common/components/loading-spinner/Spinner"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
  isFirst?: boolean
}

const Item = ({ item, type = "full", currencyCode, isFirst = false }: ItemProps) => {
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
  const originalPrice:any = original_total
  const currentPrice: any = total
  const hasReducedPrice: any = currentPrice < originalPrice
  
  const hasReducedUnitPrice = total < original_total
  const unitPricePercentageDiff = Math.round(
    ((original_total - total) / original_total) * 100
  )

  return (
    <div className="bg-white p-5 relative" data-testid="product-row">
      <DeleteButton
        id={item.id}
        className="absolute top-3 right-0"
        data-testid="product-delete-button"
      />

      <div className="flex gap-4 items-start">
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

        <div className="flex-grow min-w-0">
          <LocalizedClientLink
            href={`/${item.product_handle}`}
            className="block mb-3"
          >
            <h3
              className="text-secondary text-[18px] font-normal leading-snug hover:opacity-80"
              data-testid="product-title"
            >
              {item.product_title}
              {item.variant?.title &&
                item.variant.title !== "Default variant" &&
                ` - ${item.variant.title}`}
            </h3>
          </LocalizedClientLink>

          <div className="text-[18px] text-primary font-bold mb-4">
            {hasReducedUnitPrice && (
              <>
                <span
                  className="line-through text-ui-fg-muted mr-2"
                  data-testid="product-unit-original-price"
                >
                  {convertToLocale({
                    amount: original_total / item.quantity,
                    currency_code: currencyCode,
                  })}
                </span>
                <span className="text-ui-fg-interactive text-base mr-2">
                  -{unitPricePercentageDiff}%
                </span>
              </>
            )}
            <span
              className={clx("text-[18px]", {
                "text-ui-fg-interactive": hasReducedUnitPrice,
              })}
              data-testid="product-unit-price"
            >
              {convertToLocale({
                amount: total / item.quantity,
                currency_code: currencyCode,
              })}
            </span>
          </div>

          {type === "full" && (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrementQuantity}
                  disabled={updating || item.quantity <= 1}
                  className={clx(
                    "w-8 h-8 flex items-center justify-center border border-primary rounded text-primary bg-white hover:bg-primary hover:text-white transition-colors text-lg font-light",
                    (updating || item.quantity <= 1) &&
                      "opacity-40 cursor-not-allowed hover:bg-white hover:text-primary"
                  )}
                  data-testid="product-decrease-button"
                >
                  -
                </button>

                <div className="w-12 h-8 flex items-center justify-center border border-primary rounded bg-white text-secondary font-medium text-sm">
                  {item.quantity}
                </div>

                <button
                  onClick={incrementQuantity}
                  disabled={updating}
                  className={clx(
                    "w-8 h-8 flex items-center justify-center border border-primary rounded text-primary bg-white hover:bg-primary hover:text-white transition-colors text-lg font-light",
                    updating &&
                      "opacity-40 cursor-not-allowed hover:bg-white hover:text-primary"
                  )}
                  data-testid="product-increase-button"
                >
                  +
                </button>

                {updating && (
                  <Spinner />
                  // <span className="text-xs text-gray-500 ml-2">Updating...</span>
                )}
              </div>

              <ErrorMessage error={error} data-testid="product-error-message" />
            </>
          )}

          {type === "preview" && (
            <div className="mb-2">
              <span className="text-secondary text-base-regular">
                Ποσότητα: {item.quantity}
                {item.quantity > 1 && (
                  <>
                    {" "}
                    *{" "}
                    {convertToLocale({
                      amount: total / item.quantity,
                      currency_code: currencyCode,
                    })}
                  </>
                )}
              </span>
            </div>
          )}

          <div className="mt-4">
            {hasReducedPrice && (
              <div className="mb-1">
                {type === "default" && (
                  <span className="text-ui-fg-subtle">Original: </span>
                )}
                <span
                  className="line-through text-ui-fg-muted"
                  data-testid="product-original-price"
                >
                  {convertToLocale({
                    amount: originalPrice,
                    currency_code: currencyCode,
                  })}
                </span>
                {type === "default" && (
                  <span className="text-ui-fg-interactive ml-2">
                    -{getPercentageDiff(originalPrice, currentPrice || 0)}%
                  </span>
                )}
              </div>
            )}
            {/* <div
              className={clx("text-base-regular text-primary", {
                "text-ui-fg-interactive": hasReducedPrice,
              })}
              data-testid="product-price"
            >
              {convertToLocale({
                amount: currentPrice,
                currency_code: currencyCode,
              })}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item