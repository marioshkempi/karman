"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "../product-preview/price"
import Image from "next/image"
import { addToCart } from "@lib/data/cart"
import ProductFlags from "@modules/products/components/product-flags/product-flags"
import { sanitizeHTML } from "@lib/util/sanitizeHTML"
import { useTracking } from "@lib/hooks/use-tracking"
import WishlistButton from "@modules/products/components/wishlist-button"
import LoginPromptModal from "@modules/layout/components/login-prompt-modal"
import { useTranslations } from "next-intl"

export default function ProductPreviewList({
  product,
  region,
  countryCode,
  isNew,
  tracking,
  discount,
}: {
  product: any
  region: HttpTypes.StoreRegion
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

  return (
    <>
      <div className="border border-darkGray rounded-[5px] flex flex-row h-[180px] lg:h-[220px] overflow-hidden">
        <LocalizedClientLink
          href={`/${product.handle}`}
          className="block relative w-[140px] lg:w-[200px] flex-shrink-0 bg-gray-50"
        >
          <ProductFlags
            isOutOfStock={isOutOfStock}
            isNewProduct={isNew}
            cubikPrice={discount}
          />
          <div
            className="absolute top-2 right-2 z-10"
            onClick={(e) => e.preventDefault()}
          >
            <WishlistButton
              variantId={selectedVariant?.id}
              showLabel={false}
              onLoginRequired={() => setShowLoginModal(true)}
            />
          </div>
          <Image
            src={
              product.thumbnail ||
              product.images?.[0]?.url ||
              "/placeholder-image.jpg"
            }
            alt={product.title}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 140px, 200px"
          />
        </LocalizedClientLink>

        <div className="flex flex-col justify-between flex-1 min-w-0 p-3 lg:p-4">
          <div className="flex flex-col gap-1">
            <LocalizedClientLink href={`/${product.handle}`}>
              <h3 className="text-black font-bold text-[14px] lg:text-[15px] leading-tight line-clamp-2">
                {product.title}
              </h3>
            </LocalizedClientLink>

            {(product.subtitle || product.description) && (
              <div
                className="text-[#777777] text-[12px] lg:text-xs leading-snug line-clamp-2 [&_*]:font-normal prod-list-desc"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(
                    (product.subtitle || product.description)!
                  ).replace(/^[""]|[""]$/g, ""),
                }}
              />
            )}

            <div className="mt-1 flex">
              <PreviewPrice
                originalPrice={product.price}
                cubikPrice={discount}
                currency={product.currency}
              />
            </div>
          </div>

          <div className="mt-2">
            {isOutOfStock || variantCount > 1 ? (
              <LocalizedClientLink href={`/${product.handle}`}>
                <button className="w-full lg:w-auto py-1.5 px-4 border border-primary text-gray-600 text-[10px] lg:text-xs rounded-[5px] hover:bg-gray-50 transition">
                  {t("product.learnMore")}
                </button>
              </LocalizedClientLink>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full py-1.5 px-4 text-[10px] lg:text-xs font-medium rounded-[5px] border border-primary hover:bg-primary hover:text-white transition disabled:opacity-50"
              >
                {isAdding ? t("product.adding") : t("product.buy")}
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message={t("product.wishlistLoginRequired")}
      />
    </>
  )
}
