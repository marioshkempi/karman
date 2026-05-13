"use client"
import { Text } from "@medusajs/ui"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"

const optionsAsKeymap = (variantOptions: any) => {
  if (!variantOptions) return {}
  return variantOptions.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductCartSection({ product }: { product: any }) {
  const t = useTranslations()
  const [options, setOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const params = useParams()

  useEffect(() => {
    if (product.variants?.length === 1) {
      setOptions(optionsAsKeymap(product.variants[0].options))
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants?.length) return null
    return product.variants.find((v: any) => {
      const variantOptions = optionsAsKeymap(v.options)
      return Object.entries(options).every(
        ([key, value]) => variantOptions[key] === value
      )
    })
  }, [product.variants, options])

  const stockStatus = useMemo(() => {
    if (!selectedVariant)
      return { text: t("product.selectVariant"), inStock: false }
    if (!selectedVariant.manage_inventory || selectedVariant.allow_backorder) {
      return { text: t("product.addToCart"), inStock: true }
    }
    const qty = selectedVariant.inventory_quantity || 0
    if (qty > 0) return { text: t("product.addToCart"), inStock: true }
    return { text: t("product.outOfStock"), inStock: false }
  }, [selectedVariant])

  const stockQuantity = selectedVariant?.inventory_quantity || 0

  const incrementQuantity = () => {
    if (!selectedVariant?.manage_inventory || selectedVariant?.allow_backorder) {
      setQuantity((prev) => prev + 1)
    } else if (quantity < stockQuantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1)
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !params.countryCode) return
    setIsAdding(true)
    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        // countryCode: params.countryCode as string,
      })
    } catch (err) {
      console.error("Failed to add to cart", err)
    } finally {
      setIsAdding(false)
    }
  }

  const filteredOptions = (product.options || []).filter(
    (option: any) => option.title?.toLowerCase() !== "default option"
  )

  const hasValidOptions = filteredOptions.length > 0

  return (
    <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
      {hasValidOptions ? (
        filteredOptions.map((option: any) => (
          <div key={option.id}>
            <div className="flex items-center gap-2 mb-2">
              <Text className="font-semibold text-xs">{option.title}:</Text>
              <Text className="text-xs text-ui-fg-muted">
                {options[option.id] || "Select"}
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {(option.values || []).map((value: any) => (
                <button
                  key={value.value}
                  onClick={() =>
                    setOptions((prev) => ({ ...prev, [option.id]: value.value }))
                  }
                  disabled={isAdding}
                  className={`text-xs py-1.5 px-3 rounded border transition-colors ${
                    options[option.id] === value.value
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {value.value}
                </button>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="" />
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isAdding || !stockStatus.inStock}
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-3 h-3" />
          </button>
          <div className="w-12 h-8 flex items-center justify-center border rounded bg-white">
            <Text className="font-semibold text-sm">{quantity}</Text>
          </div>
          <button
            onClick={incrementQuantity}
            disabled={
              isAdding ||
              !stockStatus.inStock ||
              (selectedVariant?.manage_inventory &&
                !selectedVariant?.allow_backorder &&
                quantity >= stockQuantity)
            }
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!stockStatus.inStock || !selectedVariant || isAdding}
          className="flex-1 bg-primary text-white py-2 rounded text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {stockStatus.text}
            </>
          )}
        </button>
      </div>
    </div>
  )
}