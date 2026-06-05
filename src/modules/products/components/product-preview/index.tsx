"use client"

import React, { useState } from "react"
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
import { Star, ShoppingCart } from "lucide-react"

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  // Get rating data
  const rating = product.rating ?? product.average_rating ?? 4.0
  const reviewCount = product.review_count ?? product.reviews_count ?? 3

  return (
    <>
      <div className="bg-white h-full flex flex-col">
        {/* Image Container - border only here */}
        <div className="relative aspect-square bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
          <LocalizedClientLink href={`/${product.handle}`} className="block h-full">
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
              className="object-contain p-2"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </LocalizedClientLink>
          
          {/* Wishlist Button - Top Right */}
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton
              variantId={selectedVariant?.id}
              showLabel={false}
              onLoginRequired={() => setShowLoginModal(true)}
            />
          </div>
        </div>

        {/* Content - no border */}
        <div className="pt-3 flex flex-col flex-grow">
          {/* Rating Row */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{rating.toFixed(2)}</span>
            <span className="text-sm text-gray-400">({reviewCount})</span>
          </div>

          {/* Product Title */}
          <LocalizedClientLink href={`/${product.handle}`} className="block flex-grow">
            <h3 className="text-gray-900 font-medium text-sm leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">
              {product.title}
            </h3>
          </LocalizedClientLink>

          {/* Price and Cart Button Row */}
          <div className="flex items-center justify-between mt-auto">
            <PreviewPrice
              originalPrice={product.price}
              cubikPrice={discount}
              currency={product.currency}
            />
            
            {/* Cart Button */}
            {!isOutOfStock && variantCount === 1 && (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={cn(
                  "w-10 h-10 rounded-md flex items-center justify-center transition-colors",
                  isAdding 
                    ? "bg-[#1A2B3C]" 
                    : "bg-[#007BFF] hover:bg-[#1A2B3C]"
                )}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
              </button>
            )}
            
            {/* Learn More for multiple variants or out of stock */}
            {(isOutOfStock || variantCount > 1) && (
              <LocalizedClientLink href={`/${product.handle}`}>
                <button className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                </button>
              </LocalizedClientLink>
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
