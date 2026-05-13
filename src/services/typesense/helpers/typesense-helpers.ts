export const sanitizeFilterValue = (val: string) => {
  return val
    .trim()
    .replace(/["'()]/g, "")
    .replace(/&&|\|\|/g, "")
    .replace(/:/g, "")
    .slice(0, 200)
}

interface SearchResult<T = any> {
  hits?: Array<{ document: T }>
  facet_counts?: Array<{
    field_name: string
    counts: any
    stats: any
  }>
  found?: number
}

type Filters = Record<string, any>

type BuildFiltersOptions = {
  allowedFields: string[]
  sanitizeKeys?: string[]
  sanitizeFn?: (value: string) => string
  minPrice?: number
  maxPrice?: number
}

export function returnProducts<T = any>(
  results: SearchResult<T>,
  newProductThreshold?: any
) {
  const cutoffUnixSeconds =
    newProductThreshold > 0
      ? Math.floor(
          (Date.now() - newProductThreshold * 24 * 60 * 60 * 1000) / 1000
        )
      : 0

  const products =
    results.hits?.map((h: any) => {
      const p: any = { ...h.document }
      p.isNew = cutoffUnixSeconds > 0 && p.created_at >= cutoffUnixSeconds
      if (p.created_at) p.created_at = new Date(p.created_at * 1000)
      if (p.updated_at) p.updated_at = new Date(p.updated_at * 1000)
      return p
    }) || []

  const facets =
    results.facet_counts?.map((f: any) => ({
      name: f.field_name,
      counts: f.counts,
      stats: f.stats,
    })) || []

  return {
    products,
    count: results.found || 0,
    facets,
  }
}

export function buildFilters(
  filters: Filters,
  {
    allowedFields,
    sanitizeKeys = [],
    sanitizeFn = (v) => v,
    minPrice,
    maxPrice,
  }: BuildFiltersOptions
): string[] {
  const result: string[] = []

  Object.keys(filters).forEach((key) => {
    if (!allowedFields.includes(key)) return

    let value = filters[key]
    if (!value) return

    const values = Array.isArray(value) ? value : [value]

    values.forEach((v) => {
      if (!v) return

      if (sanitizeKeys.includes(key)) {
        v = sanitizeFn(String(v))
      }

      result.push(`${key}:="${v}"`)
    })
  })

  if (typeof minPrice === "number" && minPrice > 0) {
    result.push(`price:>=${minPrice}`)
  }

  if (typeof maxPrice === "number" && maxPrice > 0) {
    result.push(`price:<=${maxPrice}`)
  }

  return result
}

export function transformSort(sortBy?: string | null): string | undefined {
  if (!sortBy) return undefined

  let sort = sortBy.replace("_asc", ":asc").replace("_desc", ":desc")

  if (!sort.includes(":asc") && !sort.includes(":desc")) {
    sort += ":desc"
  }

  return sort
}
