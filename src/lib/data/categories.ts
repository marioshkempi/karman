import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { findCategoryIdByHandle } from "@services/typesense/typesenseService"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children,  *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}
export const getCategoryByHandle2 = async (
  categoryHandle?: string | string[]
) => {
  if (!categoryHandle) {
    return null
  }

  const handleArray = Array.isArray(categoryHandle)
    ? categoryHandle
    : [categoryHandle]

  const handle = handleArray
    .map((segment) => decodeURIComponent(segment))
    .join("/")

  const next = {
    ...(await getCacheOptions("categories")),
  }

  const { product_categories } =
    await sdk.client.fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields:
            "*category_children,*category_children.category_children, *parent_category, *parent_category.parent_category",
          include_descendants_tree: true,
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
  console.log(product_categories)
  return product_categories?.[0] ?? null
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const fullPath = categoryHandle
    .map((segment) => decodeURIComponent(segment))
    .join("/")

  const next = { ...(await getCacheOptions("categories")) }

  const categoryId = await findCategoryIdByHandle(fullPath)

  if (categoryId) {
    return sdk.client
      .fetch<HttpTypes.StoreProductCategoryListResponse>(
        `/store/product-categories`,
        {
          query: {
            fields:
              "*category_children,*category_children.category_children,*parent_category",
            include_descendants_tree: true,
            include_ancestors_tree: true,
            id: categoryId,
          },
          next,
          cache: "force-cache",
        }
      )
      .then(({ product_categories }) => product_categories[0])
  }

  const fallbackHandle = categoryHandle[categoryHandle.length - 1]

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields:
            "*category_children,*category_children.category_children,*parent_category",
          include_descendants_tree: true,
          include_ancestors_tree: true,
          handle: fallbackHandle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}

// export const getCategoryByHandle = async (categoryHandle: string[]) => {
//
//   const handle = categoryHandle
//     .map((segment) => decodeURIComponent(segment))
//     .join("/")
//   console.log(handle)
//   const next = {
//     ...(await getCacheOptions("categories")),
//   }
//   return sdk.client
//     .fetch<HttpTypes.StoreProductCategoryListResponse>(
//       `/store/product-categories`,
//       {
//         query: {
//           fields:
//             "*category_children,*category_children.category_children, *parent_category",
//           include_descendants_tree: true,
//           include_ancestors_tree:true,
//           handle,
//         },
//         next,
//         cache: "force-cache",
//       }
//     )
//     .then(({ product_categories }) => product_categories[0])
// }
