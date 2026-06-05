"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { Repeat } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { addToCart } from "@lib/data/cart"
import Image from "next/image"
import ImageGallery from "../components/product-image-gallery"
import PaymentShowcase from "../components/product-payment-showcase"
import ProductMeta from "../components/product-meta"
import Breadcrumb from "@modules/common/components/breadcrumb"
import QuantitySelector from "../components/product-quantity-selector"
import ProductOptions from "../components/product-option"
import ProductVariantInfo from "../components/product-variant-info"
import { BundleProduct, getProductDiscountsBatch } from "@lib/data/products"
import { toast } from "@medusajs/ui"
import { useCompareStore } from "global-states/use-compare"
import Alert from "@modules/common/components/alerts/alert"
import { MyStoreProduct } from "@constants/global"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  getProductPrices,
  getProductQuantityDiscounts,
} from "@lib/data/products"
import { buildCategoryTree } from "@lib/util/build-category-tree"
import ProductFlags from "@modules/products/components/product-flags/product-flags"
import ProductPrice from "@modules/products/components/product-price"
import BannerSection from "@modules/common/components/banner-section"
import { StoreBanner } from "@lib/data/banner"
import { getImagesForVariant } from "@lib/util/getVariantImages"
import LoginPromptModal from "@modules/layout/components/login-prompt-modal"
import { useTracking } from "@lib/hooks/use-tracking"
import WishlistButton from "@modules/products/components/wishlist-button"
import ErpAttachments from "@modules/common/components/attachments/AttachmentFileItem"
import QuantityDiscountBadges from "@modules/products/components/quantity-discounts"
import { getPrimaryCategoryChain } from "@lib/util/categories"

// ── Helpers ───────────────────────────────────────────────────────────────────

const scheduleIdle =
  typeof requestIdleCallback === "function"
    ? requestIdleCallback
    : (cb: () => void) => setTimeout(cb, 50)

const cancelIdle =
  typeof cancelIdleCallback === "function"
    ? cancelIdleCallback
    : (id: any) => clearTimeout(id)

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"] | undefined
): Record<string, string> => {
  if (!variantOptions) return {}
  return variantOptions.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

// ── Types ─────────────────────────────────────────────────────────────────────

type ProductTemplateProps = {
  product: MyStoreProduct
  region: HttpTypes.StoreRegion
  countryCode?: string
  bundle?: BundleProduct
  isNew: boolean
  sidebarBanners?: StoreBanner[]
  tracking?: any
  erpAttachments?: any[]
}

// ── Component ─────────────────────────────────────────────────────────────────

const ProductDetailView: React.FC<ProductTemplateProps> = ({
  product,
  region,
  bundle,
  countryCode,
  isNew,
  sidebarBanners,
  tracking,
  erpAttachments = [],
}) => {
  const t = useTranslations()
  const { trackAddToCart } = useTracking(tracking)

  const [options, setOptions] = useState<Record<string, string>>(() => {
    if (product.variants?.length === 1) {
      return optionsAsKeymap(product.variants[0].options)
    }
    return {}
  })
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addProduct, isProductInCompare, canAddMore, removeProduct } =
    useCompareStore()
  const [isInCompare, setIsInCompare] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [cubikPrice, setCubikPrice] = useState<any>(null)
  const [quantityDiscounts, setQuantityDiscounts] = useState<any[] | null>(null)

  const [isVisible, setIsVisible] = useState(true)
  const targetRef = useRef<HTMLDivElement | null>(null)

  // ── Scroll visibility for mobile sticky bar ─────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return
      const sectionTop =
        targetRef.current.getBoundingClientRect().top + window.scrollY
      setIsVisible(
        window.scrollY <= sectionTop + targetRef.current.offsetHeight - 100
      )
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ── Compare ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (product.id) setIsInCompare(isProductInCompare(product.id))
  }, [product.id, isProductInCompare])

  const handleCompareToggle = () => {
    if (isInCompare) {
      removeProduct(product.id)
      setIsInCompare(false)
      toast.success(t("product.removedFromCompare"))
    } else {
      if (!canAddMore()) {
        toast.error(t("product.compareLimit"))
        return
      }
      const success = addProduct(product as any)
      if (success) {
        setIsInCompare(true)
        toast.success(t("product.addedToCompare"))
      } else {
        toast.error(t("product.failedToAddToCompare"))
      }
    }
  }

  // ── Selected variant ────────────────────────────────────────────────────────
  const selectedVariant: any = useMemo(() => {
    if (!product.variants?.length) return null
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return Object.entries(options).every(
        ([key, value]) => variantOptions[key] === value
      )
    })
  }, [product.variants, options])

  const variantExternalId = selectedVariant?.metadata
    ?.variant_external_id as string
  const productExternalId: any = product.external_id

  // ── Cubik discount — per variant + quantity (debounced) ─────────────────────
  const cubikAbortRef = useRef<AbortController | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!productExternalId) {
      setCubikPrice(null)
      return
    }

    const delay = quantity === 1 && cubikPrice === null ? 0 : 400
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

    let cancelled = false

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const data: any = await getProductDiscountsBatch(
          [
            {
              id_product:
                selectedVariant?.metadata?.variant_id_product ||
                product.metadata?.id_product,
              product_key: variantExternalId || productExternalId,
            },
          ],
          quantity
        )

        if (cancelled) return
        const rule = data?.rules?.find(
          (r: any) =>
            r.id_product === selectedVariant?.metadata?.variant_id_product
        )

        setCubikPrice(rule?.discount_applies != null ? rule : null)
      } catch {
        if (!cancelled) setCubikPrice(null)
      }
    }, delay)

    return () => {
      cancelled = true
      clearTimeout(debounceTimerRef.current!)
    }
  }, [productExternalId, variantExternalId, quantity])

  // ── Quantity discount tiers — per product, non-blocking ─────────────────────
  useEffect(() => {
    if (!productExternalId) {
      setQuantityDiscounts(null)
      return
    }

    let cancelled = false

    const idleId: any = scheduleIdle(() => {
      getProductQuantityDiscounts(productExternalId)
        .then((data: any) => {
          if (!cancelled) {
            setQuantityDiscounts(
              data?.status === "success" &&
                Array.isArray(data.quantity_discounts)
                ? data.quantity_discounts
                : null
            )
          }
        })
        .catch(() => {
          if (!cancelled) setQuantityDiscounts(null)
        })
    })

    return () => {
      cancelled = true
      cancelIdle(idleId)
    }
  }, [productExternalId])

  // ── Stock ───────────────────────────────────────────────────────────────────
  const stockQuantity = selectedVariant?.inventory_quantity || 0

  const stockStatus = useMemo(() => {
    if (!selectedVariant)
      return {
        text: t("product.selectVariant"),
        color: "bg-gray-100 text-gray-800 border-gray-200",
        inStock: false,
      }
    if (!selectedVariant.manage_inventory || selectedVariant.allow_backorder)
      return {
        text: t("product.addToCart"),
        color: "bg-green-100 text-green-800 border-green-200",
        inStock: true,
      }
    if (stockQuantity > 0)
      return {
        text: t("product.addToCart"),
        color: "bg-green-100 text-green-800 border-green-200",
        inStock: true,
      }
    return {
      text: t("product.outOfStockAlt"),
      color: "bg-red-100 text-red-800 border-red-200",
      inStock: false,
    }
  }, [selectedVariant, stockQuantity])

  // ── Quantity handlers ───────────────────────────────────────────────────────
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  const incrementQuantity = () => {
    if (
      !selectedVariant?.manage_inventory ||
      selectedVariant?.allow_backorder
    ) {
      setQuantity((prev) => prev + 1)
    } else if (quantity < stockQuantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1)
  }

  // ── Add to cart ─────────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return
    setIsAdding(true)
    setError(null)
    try {
      await addToCart({ variantId: selectedVariant.id, quantity })

      trackAddToCart({
        currency: "EUR",
        value: selectedVariant?.calculated_price?.calculated_amount,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            price: selectedVariant?.calculated_price?.calculated_amount,
            quantity,
            item_brand: product?.brand?.name,
            item_category: product.categories?.[0]?.name,
          },
        ],
      })
    } catch {
      setError(t("product.failedToAddToCart"))
    } finally {
      setIsAdding(false)
    }
  }

  // ── Derived data ────────────────────────────────────────────────────────────
  const hasUnmanaged = product.variants?.some((v) => !v.manage_inventory)
  const hasBackorderable = product.variants?.some((v) => v.allow_backorder)
  const isOutOfStock =
    !hasUnmanaged &&
    !hasBackorderable &&
    product.variants?.every((v) => (v.inventory_quantity || 0) <= 0)

  // @ts-ignore
  const categoryTree = buildCategoryTree(product.categories[0])

  const images = useMemo(() => {
    if (selectedVariant?.id) {
      const variantImages = getImagesForVariant(
        product,
        selectedVariant.id
      ).map((img: any) => (typeof img === "string" ? img : img.url))
      if (variantImages.length > 0) return variantImages
    }
    return product.images?.map((img) => img.url) || []
  }, [product, selectedVariant])

  // ── Attachments ─────────────────────────────────────────────────────────────
  const tabAttachments = erpAttachments.filter(
    (g: any) => g.position === "product_tab"
  )
  const productTabAttachmentsNode =
    tabAttachments.length > 0 ? (
      <ErpAttachments groups={tabAttachments} position="product_tab" />
    ) : undefined

  // ── Add to cart button (shared between desktop & mobile) ────────────────────
  const addToCartButton = (textSize: string) => (
    <button
      className={`flex-1 bg-[#007BFF] py-3 rounded-md text-white font-medium ${textSize} hover:bg-[#F97316] disabled:opacity-50 transition-colors`}
      onClick={handleAddToCart}
      disabled={!stockStatus.inStock || !selectedVariant || isAdding}
    >
      {isAdding ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          {t("product.adding")}
        </span>
      ) : (
        stockStatus.text
      )}
    </button>
  )

  const breadcrumbTree = useMemo<{ label: string; href: string }[]>(() => {
    const chain = getPrimaryCategoryChain(product)

    return chain.map((cat: any) => {
      const redirectTo = cat.metadata?.redirect_to as string | undefined
      const slug = redirectTo?.trim() ? redirectTo : cat.handle
      return {
        label: cat.name,
        href: `/${slug}`,
      }
    })
  }, [product.categories, product.metadata?.primary_category_id])

  return (
    <>
      <div
        className="bg-white"
        ref={targetRef}
      >
        {/* Main Product Section */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          {error && <Alert type="danger" title="Error!" message={error} />}

          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb
              showEllipsis={false}
              ellipsisPosition={1}
              tree={breadcrumbTree}
              categories={
                breadcrumbTree.length === 0 ? product.categories : undefined
              }
              lastLabel={product.title}
            />
          </div>

          {/* Product Title - Desktop only (above columns) */}
          <div className="hidden lg:block mb-4">
            <h1 className="text-[22px] font-bold text-[#1e3a5f]">
              {product.title}
            </h1>
            <ProductVariantInfo variant={selectedVariant} />
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row lg:gap-10">
            {/* Left Column - Image Gallery */}
            <div className="lg:w-[55%] relative mb-6 lg:mb-0">
              <ProductFlags
                isOutOfStock={isOutOfStock}
                isNewProduct={isNew}
                cubikPrice={cubikPrice}
              />
              <ImageGallery images={images} productTitle={product.title} />
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:w-[45%]">
              {/* Mobile Title */}
              <div className="lg:hidden mb-3">
                <h1 className="text-[18px] font-bold text-[#1e3a5f]">
                  {product.title}
                </h1>
                <ProductVariantInfo variant={selectedVariant} />
              </div>

              {/* Short description */}
              {product.subtitle && (
                <p className="text-gray-600 text-sm mb-4">
                  {product.subtitle}
                </p>
              )}

              {/* Price */}
              <div className="mb-4">
                <ProductPrice
                  product={product}
                  variant={selectedVariant}
                  cubikPrice={cubikPrice}
                />
              </div>

              <QuantityDiscountBadges
                discounts={quantityDiscounts}
                currentQuantity={quantity}
              />

              {/* Product Options */}
              <ProductOptions
                options={product.options || []}
                selectedOptions={options}
                onOptionChange={setOptionValue}
                disabled={isAdding}
                variants={product.variants || []}
                selectedVariant={selectedVariant}
              />

              <ErpAttachments
                groups={erpAttachments}
                position="before_add_to_cart"
              />

              {/* Quantity + Add to Cart - Desktop */}
              <div className="hidden sm:flex items-center gap-3 mt-4 mb-4">
                <QuantitySelector
                  quantity={quantity}
                  onIncrement={incrementQuantity}
                  onDecrement={decrementQuantity}
                  maxQuantity={stockQuantity}
                  manageInventory={selectedVariant?.manage_inventory ?? true}
                  allowBackorder={selectedVariant?.allow_backorder ?? false}
                  disabled={isAdding || !stockStatus.inStock}
                  size="desktop"
                />
                {addToCartButton("text-base")}
              </div>

              {/* Wishlist & Compare */}
              <div className="flex items-center gap-6 py-3 border-b border-gray-100">
                <WishlistButton
                  variantId={selectedVariant?.id}
                  onLoginRequired={() => setShowLoginModal(true)}
                />
                <button
                  onClick={handleCompareToggle}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Repeat size={18} />
                  <span className="text-sm">
                    {isInCompare ? t("product.inCompare") : t("product.compare")}
                  </span>
                </button>
              </div>

              <ErpAttachments
                groups={erpAttachments}
                position="after_add_to_cart"
              />

              {/* Payment & Reassurance Info */}
              <div className="mt-4">
                <PaymentShowcase />
              </div>

              {/* Category & Brand Info */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                {product.categories && product.categories.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Κατηγορία:</span>
                    <LocalizedClientLink
                      href={`/${product.categories[0].handle}`}
                      className="text-[#007BFF] hover:underline"
                    >
                      {product.categories[0].name}
                    </LocalizedClientLink>
                  </div>
                )}
                {product.brand && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Brand:</span>
                    <LocalizedClientLink
                      href={`/brands/${product.brand.handle}`}
                      className="text-[#007BFF] hover:underline"
                    >
                      {product.brand.name}
                    </LocalizedClientLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Meta Tabs - Full Width */}
        <div className="border-t border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <ProductMeta
              product={product}
              productTabAttachments={productTabAttachmentsNode}
            />
          </div>
        </div>

        {/* Sidebar Banners */}
        {sidebarBanners && sidebarBanners.length > 0 && (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BannerSection banners={sidebarBanners} />
          </div>
        )}

        {/* Mobile Sticky Add to Cart Bar */}
        <div
          className={`
            fixed bottom-0 left-0 right-0
            bg-white border-t border-gray-200 p-3 shadow-lg
            sm:hidden z-50
            transition-transform duration-300 ease-in-out
            ${isVisible ? "translate-y-0" : "translate-y-full"}
          `}
        >
          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            <QuantitySelector
              quantity={quantity}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
              maxQuantity={stockQuantity}
              manageInventory={selectedVariant?.manage_inventory ?? true}
              allowBackorder={selectedVariant?.allow_backorder ?? false}
              disabled={isAdding || !stockStatus.inStock}
              size="mobile"
            />
            {addToCartButton("text-base")}
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

export default ProductDetailView
