import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"
import { clx } from "@medusajs/ui"

export const getPricesForVariant = (variant: any) => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  return {
    calculated_price_number:
      variant.calculated_price.calculated_amount_with_tax,
    calculated_price: convertToLocale({
      amount: variant.calculated_price.calculated_amount_with_tax,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_number: variant.calculated_price.original_amount,
    original_price: convertToLocale({
      amount: variant.calculated_price.original_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    currency_code: variant.calculated_price.currency_code,
    price_type: variant.calculated_price.calculated_price.price_list_type,
    percentage_diff: getPercentageDiff(
      variant.calculated_price.original_amount,
      variant.calculated_price.calculated_amount
    ),
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      const currencyCode =
        product.variants?.[0]?.calculated_price?.currency_code || "EUR"
      return {
        calculated_price_number: 0,
        calculated_price: convertToLocale({
          amount: 0,
          currency_code: currencyCode,
        }),
        original_price_number: 0,
        original_price: convertToLocale({
          amount: 0,
          currency_code: currencyCode,
        }),
        currency_code: currencyCode,
        price_type: "",
        percentage_diff: "",
      }
    }

    const cheapestVariant: any = product.variants
      .filter((v: any) => !!v.calculated_price)
      .sort((a: any, b: any) => {
        return (
          a.calculated_price.calculated_amount_with_tax -
          b.calculated_price.calculated_amount_with_tax
        )
      })[0]

    const price = getPricesForVariant(cheapestVariant)
    if (!price) {
      const currencyCode =
        cheapestVariant?.calculated_price?.currency_code ||
        product.variants?.[0]?.calculated_price?.currency_code ||
        "EUR"
      return {
        calculated_price_number: 0,
        calculated_price: convertToLocale({
          amount: 0,
          currency_code: currencyCode,
        }),
        original_price_number: 0,
        original_price: convertToLocale({
          amount: 0,
          currency_code: currencyCode,
        }),
        currency_code: currencyCode,
        price_type: "",
        percentage_diff: "",
      }
    }

    return price
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}

export function applyCubikPriceRule(originalPrice: number, rule: any) {
  if (!rule) {
    return {
      finalPrice: originalPrice,
      discountAmount: 0,
      discountPercent: 0,
      applied: false,
      ruleName: null,
    }
  }

  const r = rule.price ? rule.price : rule

  // Handle both old shape (status !== "success") and new shape (discount_applies: false)
  if ((!r.discount_applies && r.status !== "success") || !r.value) {
    return {
      finalPrice: originalPrice,
      discountAmount: 0,
      discountPercent: 0,
      applied: false,
      ruleName: r.rule_name ?? null,
    }
  }

  const value = parseFloat(r.value)
  let finalPrice = originalPrice

  if (r.type === "percent") {
    finalPrice = originalPrice * (1 - value / 100)
  }

  if (r.type === "fixed" || r.type === "amount") {
    finalPrice = originalPrice - value
  }

  if (finalPrice < 0) finalPrice = 0

  const discountAmount = originalPrice - finalPrice
  const discountPercent =
    originalPrice > 0 ? (discountAmount / originalPrice) * 100 : 0

  return {
    finalPrice,
    discountAmount,
    discountPercent,
    applied: true,
    ruleName: r.rule_name ?? null,
  }
}
