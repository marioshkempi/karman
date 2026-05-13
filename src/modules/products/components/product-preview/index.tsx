"use client"

import React, { useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "./price"
import Image from "next/image"
import { cn } from "@lib/util/cn"
import { addToCart } from "@lib/data/cart"
import ProductFlags from "@modules/products/components/product-flags/product-flags"
import { useTracking } from "@lib/hooks/use-tracking"
import WishlistButton from "@modules/products/components/wishlist-button"
import LoginPromptModal from "@modules/layout/components/login-prompt-modal"
import { useTranslations } from "next-intl"

export default function ProductPreview({
  product,
  isFeatured,
  region,
  separatedButtonOnMobile,
  countryCode,
  isNew,
  tracking,
  discount,
}: {
  product: any
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  separatedButtonOnMobile?: boolean
  countryCode?: string
  isNew: boolean
  tracking?: any
  discount?: any
}) {
  if (!product) return null

  const { trackAddToCart } = useTracking(
    tracking ?? {
      fb_pixel_id: null,
      fb_pixel_enabled: false,
      gtm_id: null,
      gtm_enabled: false,
      ga4_measurement_id: null,
      ga4_enabled: false,
    }
  )

  const t = useTranslations()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const hasUnmanaged = product.variants?.some(
    (variant: any) => variant.manage_inventory === false
  )
  const hasBackorderableVariants = product.variants?.some(
    (variant: any) => variant.allow_backorder === true
  )
  const isOutOfStock =
    !hasUnmanaged &&
    !hasBackorderableVariants &&
    product.variants?.every(
      (variant: any) => (variant.inventory_quantity || 0) <= 0
    )

  const variantCount = product.variants?.length ?? 0
  const selectedVariant = product.variants?.[0]

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || isAdding) return

    try {
      setIsAdding(true)
      await addToCart({ variantId: selectedVariant.id, quantity: 1 })

      const price = selectedVariant?.calculated_price?.calculated_amount
      const currency = product.currency || region?.currency_code || "EUR"

      trackAddToCart({
        currency: currency.toUpperCase(),
        value: price ? Number(price) : undefined,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            price: price ? Number(price) : undefined,
            quantity: 1,
            item_variant: selectedVariant?.title,
            item_brand: product.brand?.name,
            item_category: product.categories?.[0]?.name,
          },
        ],
      })
    } finally {
      setIsAdding(false)
    }
  }
  // console.log("product", product)
  return (
    <>
      <div className={cn(separatedButtonOnMobile ? "flex flex-col" : "")}>
        <div className="border border-darkGray ">
          <div className="overflow-hidden">
            <div className="relative aspect-square bg-gray-50">
              <LocalizedClientLink
                href={`/${product.handle}`}
                className="block"
              >
                <ProductFlags
                  isOutOfStock={isOutOfStock}
                  isNewProduct={isNew}
                  cubikPrice={discount}
                />
                <Image
                  src={
                    product.thumbnail ||
                    product.images?.[0]?.url ||
                    "/placeholder-image.jpg"
                  }
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </LocalizedClientLink>
              <div className="absolute top-2 right-2 z-10">
                <WishlistButton
                  variantId={selectedVariant?.id}
                  showLabel={false}
                  onLoginRequired={() => setShowLoginModal(true)}
                />
              </div>
            </div>
            <LocalizedClientLink href={`/${product.handle}`} className="block">
              <div className="p-2 md:p-4 text-center h-[140px] lg:h-[180px] flex flex-col justify-between">
                <div>
                  <h3 className="text-black font-bold text-[12px] lg:text-base mb-2 min-h-[1.5em] lg:min-h-[3em]">
                    {product.title.length > 50
                      ? `${product.title.slice(0, 50)}...`
                      : product.title}
                  </h3>

                  {(product.subtitle || product.description) && (
                    <p className="text-[#777777] text-[11px] lg:text-sm mb-1.5 line-clamp-2 font-normal prod-list-desc">
                      {(product.subtitle || product.description)!
                        .replace(/<[^>]*>/g, "")
                        .replace(/&nbsp;/gi, " ")
                        .replace(/&amp;/gi, "&")
                        .replace(/&lt;/gi, "<")
                        .replace(/&gt;/gi, ">")
                        .replace(/&quot;/gi, '"')
                        .replace(/&#039;/gi, "'")
                        .replace(/^[""\s]+|[""\s]+$/g, "")
                        .trim()}
                    </p>
                  )}
                </div>

                <PreviewPrice
                  originalPrice={product.price}
                  cubikPrice={discount}
                  currency={product.currency}
                />
              </div>
            </LocalizedClientLink>
          </div>

          <div
            className={cn(
              "border-t border-darkGray rounded-b-[5px]",
              separatedButtonOnMobile ? "hidden lg:block" : ""
            )}
          >
            {isOutOfStock ? (
              <LocalizedClientLink href={`/${product.handle}`}>
                <div className="w-full py-3 text-center text-gray-500 text-sm bg-white">
                  {t("product.learnMore")}
                </div>
              </LocalizedClientLink>
            ) : variantCount === 1 ? (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full py-3 text-center text-sm font-medium hover:bg-primary hover:text-white transition disabled:opacity-50"
              >
                {isAdding ? t("product.adding") : t("product.buy")}
              </button>
            ) : (
              <LocalizedClientLink href={`/${product.handle}`}>
                <div className="w-full py-3 text-center text-sm font-medium bg-white text-gray-500">
                  {t("product.learnMore")}
                </div>
              </LocalizedClientLink>
            )}
          </div>
        </div>

        {separatedButtonOnMobile && (
          <div className="mt-2 lg:hidden">
            {isOutOfStock || variantCount > 1 ? (
              <LocalizedClientLink href={`/${product.handle}`}>
                <button className="w-full py-2 px-4 border border-primary text-gray-700 text-xs rounded-[5px]">
                  {t("product.learnMore")}
                </button>
              </LocalizedClientLink>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full py-2 px-4 border border-primary text-gray-700 text-xs rounded-[5px] disabled:opacity-50"
              >
                {isAdding ? t("product.adding") : t("product.buy")}
              </button>
            )}
          </div>
        )}
      </div>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message={t("product.wishlistLoginRequired")}
      />
    </>
  )
}
