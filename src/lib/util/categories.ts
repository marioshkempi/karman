// @lib/util/categories.ts

type CategoryLike = {
  id: string
  mpath?: string | null
  metadata?: Record<string, any> | null
  [key: string]: any
}

type ProductLike = {
  categories?: CategoryLike[] | null
  metadata?: Record<string, any> | null
}

/**
 * Resolve the primary category of a product.
 *
 * Resolution order:
 *   1. `product.metadata.primary_category_id` matched against `product.categories`
 *   2. Fallback to the first category in `product.categories`
 *   3. `null` if the product has no categories
 */
export const getPrimaryCategory = <T extends CategoryLike>(
  product: ProductLike & { categories?: T[] | null }
): T | null => {
  if (!product?.categories?.length) return null

  const primaryCategoryId = product.metadata?.primary_category_id as
    | string
    | undefined

  if (primaryCategoryId) {
    const match = product.categories.find((cat) => cat.id === primaryCategoryId)
    if (match) { // @ts-ignore
      return match
    }
  }

  return product.categories[0] ?? null
}

/**
 * Resolve the full ancestor chain of the primary category, ordered
 * root → leaf, using each category's `mpath`.
 */
export const getPrimaryCategoryChain = <T extends CategoryLike>(
  product: ProductLike & { categories?: T[] | null }
): T[] => {
  const primary = getPrimaryCategory(product)
  if (!primary) return []

  // @ts-ignore
  const categoryMap = new Map<string, T>(
    // @ts-ignore
    (product.categories ?? []).map((cat) => [cat.id, cat])
  )

  const chainIds: string[] = primary.mpath
    ? primary.mpath.split(".")
    : [primary.id]

  return chainIds
    .map((id) => categoryMap.get(id))
    .filter((cat): cat is T => Boolean(cat))
}
