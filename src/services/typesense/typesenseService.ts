import {
  sanitizeFilterValue,
  returnProducts,
  buildFilters,
  transformSort,
} from "./helpers/typesense-helpers"
import { getSiteSetting } from "@lib/data/site-settings"
import { client } from "@services/typesense/typesenseClient"

export async function searchProduct(query: string) {
  let searchRequests = {
    searches: [
      {
        collection: process.env.NEXT_PUBLIC_TYPESENSE_PRODUCTS_COLLECTION,
        q: query,
        query_by: "title,description,sku_searchable,brand",
        per_page: 10,
      },
      {
        collection: process.env.NEXT_PUBLIC_TYPESENSE_BRANDS_COLLECTION,
        q: query,
        query_by: "name",
        per_page: 5,
      },
      {
        collection: process.env.NEXT_PUBLIC_TYPESENSE_CATEGORIES_COLLECTION,
        q: query,
        query_by: "name",
        per_page: 5,
      },
    ],
  }

  let commonSearchParams = {
    // 'query_by': 'name,title,description,sku_searchable',
  }

  return await client.multiSearch.perform(searchRequests, commonSearchParams)
}

export async function searchPageGetProducts(
  query: string,
  page = 1,
  perPage = 12,
  sortBy: string = "created_at:asc",
  filters: Record<string, string | string[]> = {},
  min_price: number = 0,
  max_price: number = 0
) {
  if (!query.trim()) {
    return { products: [], count: 0, facets: [] }
  }

  const sort = transformSort(sortBy)

  const allowedFilterFields = ["categories_searchable", "brand", "features"]

  const filterArr = buildFilters(filters, {
    allowedFields: allowedFilterFields,
    sanitizeKeys: ["categories_searchable", "brand"],
    sanitizeFn: sanitizeFilterValue,
    minPrice: min_price,
    maxPrice: max_price,
  })

  const filterString = filterArr.join(" && ") || undefined

  const results = await client
    .collections(process.env.NEXT_PUBLIC_TYPESENSE_PRODUCTS_COLLECTION || "")
    .documents()
    .search({
      q: query,
      query_by: "title,description,sku_searchable,brand",
      num_typos: 1,
      typo_tokens_threshold: 1,
      page,
      per_page: perPage,
      prefix: true,
      filter_by: filterString,
      sort_by: sort,
      facet_by: "categories_searchable,brand,features,price",
    })
  return returnProducts(results)
}

export async function storeGetAllProducts(
  page = 1,
  perPage = 12,
  sortBy: string = "created_at:asc",
  filters: Record<string, string | string[]> = {},
  min_price: number = 0,
  max_price: number = 0
) {
  const sort = transformSort(sortBy)

  const allowedFilterFields = ["categories_searchable", "brand", "features"]

  const filterArr = buildFilters(filters, {
    allowedFields: allowedFilterFields,
    sanitizeKeys: ["categories_searchable", "brand"],
    sanitizeFn: sanitizeFilterValue,
    minPrice: min_price,
    maxPrice: max_price,
  })

  const filterString = filterArr.join(" && ") || undefined

  const results = await client
    .collections(process.env.NEXT_PUBLIC_TYPESENSE_PRODUCTS_COLLECTION || "")
    .documents()
    .search({
      q: "*",
      query_by: "title,description,sku_searchable,brand",
      num_typos: 1,
      typo_tokens_threshold: 1,
      page,
      per_page: perPage,
      prefix: true,
      filter_by: filterString,
      sort_by: sort,
      facet_by: "categories_searchable,brand,features,price",
    })
  return returnProducts(results)
}

export async function categoryGetProducts(
  query: string,
  page = 1,
  perPage = 12,
  sortBy: string = "created_at:asc",
  filters: Record<string, string | string[]> = {},
  min_price: number = 0,
  max_price: number = 0
) {
  if (!query.trim()) {
    return { products: [], count: 0, facets: [] }
  }
  const sort = transformSort(sortBy)

  const allowedFilterFields = [
    "categories_searchable",
    "categories_ids",
    "options_facet",
    "brand",
    "features",
    "category_ancestors",
  ]

  const filterArr = buildFilters(filters, {
    allowedFields: allowedFilterFields,
    sanitizeKeys: ["categories_searchable", "brand"],
    sanitizeFn: sanitizeFilterValue,
    minPrice: min_price,
    maxPrice: max_price,
  })

  // Match the category itself + everything in its subtree
  filterArr.push(`category_ancestors:=[\`${query}\`]`)

  const filterString = filterArr.join(" && ") || undefined

  const results = await client
    .collections(process.env.NEXT_PUBLIC_TYPESENSE_PRODUCTS_COLLECTION || "")
    .documents()
    .search({
      q: "*",
      query_by: "title",
      page,
      per_page: perPage,
      sort_by: sort,
      filter_by: filterString,
      max_facet_values: 250,
      facet_by:
        "categories_searchable(sort_by:_alpha:asc),brand(sort_by:_alpha:asc),features(sort_by:_alpha:asc),options_facet(sort_by:_alpha:asc),price",
    })

  return returnProducts(results)
}
export async function brandGetProducts(
  query: string,
  page = 1,
  perPage = 12,
  sortBy: string = "created_at:asc",
  filters: Record<string, string | string[]> = {},
  min_price: number = 0,
  max_price: number = 0
) {
  if (!query.trim()) {
    return { products: [], count: 0, facets: [] }
  }
  const sort: any = transformSort(sortBy)

  const allowedFilterFields = [
    "categories_searchable",
    "categories_ids",
    "features",
  ]

  const filterArr = buildFilters(filters, {
    allowedFields: allowedFilterFields,
    sanitizeKeys: ["categories_searchable", "brand"],
    sanitizeFn: sanitizeFilterValue,
    minPrice: min_price,
    maxPrice: max_price,
  })

  const filterString = filterArr.join(" && ") || undefined

  const results = await client
    .collections(process.env.NEXT_PUBLIC_TYPESENSE_PRODUCTS_COLLECTION || "")
    .documents()
    .search({
      q: query,
      query_by: "brand_id",
      num_typos: 0,
      typo_tokens_threshold: 0,
      page,
      per_page: perPage,
      prefix: false,
      sort_by: sort,
      filter_by: filterString,
      facet_by: "categories_searchable,features,price",
      max_facet_values: 150,
    })

  return returnProducts(results)
}

export async function newProductsGetProducts(
  page = 1,
  perPage = 10,
  sortBy: string = "created_at:desc"
) {
  // get threshold days from settings
  const newProductThreshold = await getSiteSetting("new_product_threshold")
  const thresholdDays = Number(newProductThreshold || 0)

  if (!thresholdDays) {
    return { products: [], count: 0, facets: [] }
  }

  // compute cutoff timestamp in SECONDS
  const nowMs = Date.now()
  const cutoffMs = nowMs - thresholdDays * 24 * 60 * 60 * 1000
  const cutoffUnixSeconds = Math.floor(cutoffMs / 1000)

  const sort = transformSort(sortBy)

  const results = await client
    .collections(process.env.NEXT_PUBLIC_TYPESENSE_PRODUCTS_COLLECTION || "")
    .documents()
    .search({
      q: "*",
      query_by: "title", // or any indexed field
      page,
      per_page: perPage,
      sort_by: sort,
      filter_by: `created_at:>=${cutoffUnixSeconds}`, // ONLY CRITERION
    })

  return returnProducts(results)
}

export async function getSameCategoryProducts(
  categoryIds: string | string[],
  excludeProductId: string,
  page = 1,
  perPage = 12,
  sortBy: string = "created_at:desc"
) {
  if (!categoryIds || (Array.isArray(categoryIds) && !categoryIds.length)) {
    return { products: [], count: 0 }
  }

  try {
    const sort = transformSort(sortBy)

    const newProductsThreshold = await getSiteSetting("new_product_threshold")

    const categoryFilter = Array.isArray(categoryIds)
      ? `categories_ids:=[${categoryIds.join(",")}]`
      : `categories_ids:=${categoryIds}`

    const filterString = [
      categoryFilter,
      `id_product:!=${excludeProductId}`,
    ].join(" && ")

    const results = await client
      .collections(process.env.NEXT_PUBLIC_TYPESENSE_PRODUCTS_COLLECTION!)
      .documents()
      .search({
        q: "*",
        query_by: "categories_ids",
        page,
        per_page: perPage,
        sort_by: sort,
        filter_by: filterString,
      })

    return returnProducts(results, newProductsThreshold)
  } catch {
    return { products: [], count: 0 }
  }
}

export async function getPaginatedBrands(
  page: number = 1,
  perPage: number = 15
) {
  try {
    const showBrandsWithNoProducts = await getSiteSetting(
      "show_brands_without_products"
    )
    let filterBy: any
    if (!showBrandsWithNoProducts) {
      filterBy = "product_count:>0"
    }
    const results = await client
      .collections(process.env.NEXT_PUBLIC_TYPESENSE_BRAND_COLLECTION || "")
      .documents()
      .search({
        q: "*",
        query_by: "name",
        per_page: perPage,
        page: page,
        sort_by: "name:asc",
        // filter_by: filterBy,
        ...(filterBy && { filter_by: filterBy }),
      })

    return {
      brands: results.hits?.map((hit: any) => hit.document) || [],
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalPages: Math.ceil((results.found || 0) / perPage),
        totalItems: results.found || 0,
        hasNextPage: page < Math.ceil((results.found || 0) / perPage),
        hasPreviousPage: page > 1,
      },
    }
  } catch (error: any) {
    return {
      brands: [],
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }
}

export async function getRelatedProducts(
  externalIds: string | string[],
  page = 1,
  perPage = 12,
  sortBy: string = "quantity_available:desc"
) {
  if (!externalIds || (Array.isArray(externalIds) && !externalIds.length)) {
    return { products: [], count: 0 }
  }
  try {
    let ids: string[]
    if (typeof externalIds === "string") {
      ids = externalIds
        .replace(/[{}]/g, "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    } else {
      ids = externalIds.flatMap((id) =>
        id
          .replace(/[{}]/g, "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    }

    if (!ids.length) return { products: [], count: 0 }

    const sort = transformSort(sortBy)
    const newProductsThreshold = await getSiteSetting("new_product_threshold")

    const externalIdFilter =
      ids.length > 1
        ? `external_id:=[${ids.join(",")}]`
        : `external_id:=${ids[0]}`

    const results = await client
      .collections(process.env.NEXT_PUBLIC_TYPESENSE_PRODUCTS_COLLECTION!)
      .documents()
      .search({
        q: "*",
        query_by: "external_id",
        page,
        per_page: perPage,
        sort_by: sort,
        filter_by: externalIdFilter,
        include_fields: [
          "id",
          "id_product",
          "title",
          "handle",
          "thumbnail",
          "sku_searchable",
          "brand",
          "brand_id",
          "price",
          "tecdocCode",
          "categories_ids",
          "categories_searchable",
          "primary_category_id",
          "quantity_available",
          "variants",
          "metadata",
          "created_at",
          "status",
          "reviews_count",
          "reviews_avg",
          "external_id",
          "currency",
        ].join(","),
      })

    return returnProducts(results, newProductsThreshold)
  } catch {
    return { products: [], count: 0 }
  }
}

/**
 * Find a category id by exact-match on its (rewritten) handle in Typesense.
 *
 * Reusable wherever you need to translate a URL path → category id without
 * touching the Medusa backend.
 *
 * Returns null if the handle isn't indexed yet (newly created category that
 * hasn't been synced) or if Typesense is unreachable.
 */
export async function findCategoryIdByHandle(
  handle: string
): Promise<string | null> {
  if (!handle?.trim()) return null

  const safe = handle.replace(/`/g, "")

  try {
    const results = await client
      .collections(
        process.env.NEXT_PUBLIC_TYPESENSE_CATEGORIES_COLLECTION || ""
      )
      .documents()
      .search({
        q: "*",
        query_by: "handle",
        filter_by: `handle:=\`${safe}\``,
        per_page: 1,
        include_fields: "id",
      })

    return (results.hits?.[0]?.document as any)?.id ?? null
  } catch {
    return null
  }
}
