"use client"

import { X, Grid3x3, List } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import SortProducts from "../refinement-list/sort-products"
import { useCategoryViewStore } from "../../../../global-states/use-category-view"
import { useTranslations } from "next-intl"

const EXCLUDE_KEYS = [
  "q",
  "page",
  "sortBy",
  "price_floor",
  "price_ceil",
  "min_price",
  "max_price",
]

const ViewToggle = ({
  viewMode,
  setViewMode,
}: {
  viewMode: string
  setViewMode: (mode: "grid" | "list") => void
}) => (
  <div className="flex items-center gap-2">
    <button
      onClick={() => setViewMode("grid")}
      className={`flex items-center gap-2 px-0 py-0 bg-white transition-colors ${
        viewMode === "grid"
          ? "text-primary"
          : "border-gray-300 text-inactiveGray hover:border-primary hover:text-primary"
      }`}
    >
      <Grid3x3 size={18} />
    </button>

    <button
      onClick={() => setViewMode("list")}
      className={`flex items-center gap-2 px-0 py-0 bg-white transition-colors ${
        viewMode === "list"
          ? "border-primary text-primary"
          : "border-gray-300 text-inactiveGray hover:border-primary hover:text-primary"
      }`}
    >
      <List size={18} />
    </button>
  </div>
)

export default function ProductListHeader() {
  const t = useTranslations()
  const { viewMode, setViewMode } = useCategoryViewStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const FACET_LABEL_MAP: Record<string, string> = {
    brand: t("store.brand"),
    categories_searchable: t("store.category"),
    min_price: t("store.minPrice"),
    max_price: t("store.maxPrice"),
  }

  const parseFeatureLabel = (raw: string) => {
    const parts = raw.split(":")
    if (parts.length > 1) {
      return {
        name: parts[0].trim(),
        value: parts.slice(1).join(":").trim(),
      }
    }
    return {
      name: t("store.feature"),
      value: raw,
    }
  }

  const activeFilters: Array<{
    key: string
    label: string
    value: string
    rawValue: string
  }> = []

  const minPrice = searchParams.get("min_price")
  const maxPrice = searchParams.get("max_price")

  if (minPrice || maxPrice) {
    const parts: string[] = []
    if (minPrice) parts.push(minPrice.replace(".", ","))
    if (maxPrice) parts.push(maxPrice.replace(".", ","))

    activeFilters.push({
      key: "price_range",
      label: t("product.price"),
      value: parts.join(" - ") + " €",
      rawValue: "",
    })
  }

  Array.from(new Set(searchParams.keys())).forEach((key) => {
    if ([...EXCLUDE_KEYS, "min_price", "max_price"].includes(key)) return

    const values = searchParams.getAll(key)

    values.forEach((v) => {
      if (key === "features") {
        const parsed = parseFeatureLabel(v)
        activeFilters.push({
          key,
          label: parsed.name,
          value: parsed.value,
          rawValue: v,
        })
        return
      }

      activeFilters.push({
        key,
        label: FACET_LABEL_MAP[key] ?? key.replace(/_/g, " "),
        value: v,
        rawValue: v,
      })
    })
  })

  const removeFilter = (filterKey: string, filterValue?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (filterKey === "price_range") {
      params.delete("min_price")
      params.delete("max_price")
    } else if (filterValue) {
      const remaining = params
        .getAll(filterKey)
        .filter((v) => v !== filterValue)

      params.delete(filterKey)
      remaining.forEach((v) => params.append(filterKey, v))
    }

    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="mb-4">
      {/* Mobile */}
      <div className="lg:hidden space-y-3">
        <div className="items-center justify-between gap-3 w-full">
          <SortProducts data-testid="product-sort" />
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex items-center md:justify-end align-middle gap-4 mb-4">
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        <SortProducts data-testid="product-sort" />
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
          {activeFilters.map((filter, index) => {
            // Parse options_facet values: "Color: Navy Blue|#1B2A4A|https://img.url"
            let displayLabel = filter.value
            let hex: string | null = null
            let imageUrl: string | null = null

            if (filter.key === "options_facet") {
              const colonIdx = filter.value.indexOf(": ")
              const rest =
                colonIdx !== -1
                  ? filter.value.substring(colonIdx + 2)
                  : filter.value

              const parts = rest.split("|")
              displayLabel = parts[0]
              hex = parts[1] || null
              imageUrl = parts[2] || null
            }

            return (
              <div
                key={`${filter.key}-${filter.value}-${index}`}
                className="flex items-center gap-2 px-3 py-1.5 border border-primary rounded-[50px]"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={displayLabel}
                    className="w-4 h-4 rounded-full object-cover flex-shrink-0"
                  />
                ) : hex ? (
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: hex,
                      boxShadow: (() => {
                        const c = hex.replace("#", "")
                        const r = parseInt(c.substring(0, 2), 16)
                        const g = parseInt(c.substring(2, 4), 16)
                        const b = parseInt(c.substring(4, 6), 16)
                        return (r * 299 + g * 587 + b * 114) / 1000 > 200
                      })()
                        ? "inset 0 0 0 1px rgba(0,0,0,0.12)"
                        : "none",
                    }}
                  />
                ) : null}

                <span className="text-[14px] text-gray-700">
                  {displayLabel}
                </span>

                <button
                  onClick={() => removeFilter(filter.key, filter.rawValue)}
                  className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200"
                  aria-label={`Remove ${displayLabel}`}
                >
                  <X size={12} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
