// lib/utils/normalize-facets.ts

export interface NormalizedFacetItem {
  value: string
  count?: number
}

export interface NormalizedFacet {
  key: string
  title: string
  raw: any
  items: NormalizedFacetItem[]
  stats: any | null
}

export const normalizeFacets = (
  facets: any[] = [],
  facetTitleMap: Record<string, string> = {}
): NormalizedFacet[] => {
  return facets
    .map((f) => {
      const key = f.name || f.title
      const title = facetTitleMap[key] || key

      const items = Array.isArray(f.counts)
        ? f.counts
        : Array.isArray(f.options)
        ? f.options
        : []

      const normalizedItems: NormalizedFacetItem[] = items.map((it: any) => {
        if (typeof it === "string") {
          return { value: it, count: undefined }
        }

        if (it && typeof it === "object") {
          return {
            value: String(it.value ?? it.highlighted ?? ""),
            count: typeof it.count === "number" ? it.count : undefined,
          }
        }

        return { value: String(it), count: undefined }
      })

      return {
        key,
        title,
        raw: f,
        items: normalizedItems,
        stats: f.stats ?? null,
      }
    })
    .filter((f) => {
      if (f.items.length > 0) return true
      if (f.stats && f.stats.min !== f.stats.max) return true
      return false
    })
}
