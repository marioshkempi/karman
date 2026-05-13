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
  // console.log("cubikPrice", cubikPrice)
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
      className={`flex-1 bg-primary py-3 sm:py-2 rounded-[5px] text-white ${textSize} hover:opacity-90 disabled:opacity-50 transition-colors`}
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
        className="max-w-[1350px] mx-auto px-3 sm:px-3 lg:px-6 md:py-4 sm:py-3 sm:pb-6 z-[9] relative"
        ref={targetRef}
      >
        {error && <Alert type="danger" title="Error!" message={error} />}

        <div>
          <Breadcrumb
            showEllipsis={false}
            ellipsisPosition={1}
            tree={breadcrumbTree}
            categories={
              breadcrumbTree.length === 0 ? product.categories : undefined
            }
            lastLabel={product.title}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <ProductFlags
                isOutOfStock={isOutOfStock}
                isNewProduct={isNew}
                cubikPrice={cubikPrice}
              />
              <ImageGallery images={images} productTitle={product.title} />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-2">
                  <h1 className="text-[20px] lg:text-[26px] font-bold text-primary2 leading-tight lg:max-w-[100%]">
                    {product.title}
                  </h1>
                  {product.brand?.image_url &&
                    product.brand.image_url.length > 0 && (
                      <div className="flex-shrink-0 border border-lightgray">
                        <LocalizedClientLink
                          href={`/brands/${product.brand.handle}`}
                        >
                          <Image
                            src={product.brand.image_url}
                            alt="Brand Logo"
                            width={120}
                            height={60}
                            className="object-contain p-2 py-0"
                          />
                        </LocalizedClientLink>
                      </div>
                    )}
                </div>

                <ProductVariantInfo variant={selectedVariant} />

                {product.subtitle && (
                  <p className="text-secondary text-base lg:text-lg mt-3">
                    {product.subtitle}
                  </p>
                )}

                <ProductPrice
                  product={product}
                  variant={selectedVariant}
                  cubikPrice={cubikPrice}
                />

                <QuantityDiscountBadges
                  discounts={quantityDiscounts}
                  currentQuantity={quantity}
                />
              </div>

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

              <div className="mt-1 hidden sm:flex items-center gap-4">
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
                {addToCartButton("text-[22px]")}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-4">
                <WishlistButton
                  variantId={selectedVariant?.id}
                  onLoginRequired={() => setShowLoginModal(true)}
                />
                <button
                  onClick={handleCompareToggle}
                  className="flex items-center gap-2"
                >
                  <Repeat size={20} className="w-5 h-5 text-primary" />
                  <span
                    className={`text-[18px] ${
                      isInCompare
                        ? "text-primary font-semibold"
                        : "text-secondary"
                    }`}
                  >
                    {isInCompare
                      ? t("product.inCompare")
                      : t("product.compare")}
                  </span>
                </button>
              </div>

              <ErpAttachments
                groups={erpAttachments}
                position="after_add_to_cart"
              />

              <PaymentShowcase />
              <ProductMeta
                product={product}
                productTabAttachments={productTabAttachmentsNode}
              />
            </div>
          </div>

          {sidebarBanners && sidebarBanners.length > 0 && (
            <div className="mt-8">
              <BannerSection banners={sidebarBanners} />
            </div>
          )}

          {/* Mobile sticky bar */}
          <div
            className={`
              fixed bottom-0 left-0 right-0
              bg-quaternary border-t border-gray-200 p-3 shadow-lg
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
              {addToCartButton("text-[18px]")}
            </div>
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
