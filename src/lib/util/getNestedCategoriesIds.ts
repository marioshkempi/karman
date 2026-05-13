import { HttpTypes } from "@medusajs/types"

export const getNestedCategoryIds = (
  category: HttpTypes.StoreProductCategory
): string[] => {
  const ids: string[] = [category.id]

  if (category.category_children?.length) {
    category.category_children.forEach((child: any) => {
      ids.push(...getNestedCategoryIds(child))
    })
  }

  return ids
}
