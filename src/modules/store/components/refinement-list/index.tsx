"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CloseRounded from "@modules/common/icons/closeRounded"
import MobileFilter from "@modules/common/icons/filterMobile"
import X from "@modules/common/icons/x"
import { normalizeFacets } from "@lib/util/normalize-facets"
import { renderFacet } from "@modules/store/components/refinement-list/render-facet"
import { renderPriceFacet } from "@modules/store/components/refinement-list/render-facet/renderPriceBlockFacet"
import { useTranslations } from "next-intl"

const STEP = 0.01
const DEFAULT_OPEN = ["categories_searchable"]

interface RefinementListProps {
  facets?: any[]
  count?: number
}

const RefinementList = ({ facets = [], count }: RefinementListProps) => {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()

  const FACET_TITLE_MAP: Record<string, string> = {
    categories_searchable: t("navigation.categories"),
    variant_option_ids: t("store.filters"),
    brand: t("store.brand"),
  }

  const [mobileOpen, setMobileOpen] = useState(false)
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [priceResetKey, setPriceResetKey] = useState(0)

  const [priceBounds, setPriceBounds] = useState<{
    min: number
    max: number
  } | null>(null)

  const params = new URLSearchParams(searchParams.toString())

  const roundPrice = (v: number) => Math.round(v * 100) / 100

  const parsePrice = (v: string) => {
    const normalized = v.replace(",", ".")
    const n = Number(normalized)
    return Number.isFinite(n) ? n : null
  }

  const formatPrice = (v: number | null) =>
    typeof v === "number" ? v.toFixed(2) : "—"

  const toggleFacet = (facetName: string, value: string, checked: boolean) => {
    const existing = params.getAll(facetName)

    if (checked) {
      params.append(facetName, value)
    } else {
      const filtered = existing.filter((v) => v !== value)
      params.delete(facetName)
      filtered.forEach((v) => params.append(facetName, v))
    }

    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  const normalizedFacets = normalizeFacets(facets, FACET_TITLE_MAP)
  const priceFacet: any = normalizedFacets.find((f) => f.key === "price")

  useEffect(() => {
    if (priceBounds) return

    const floorRaw = searchParams.get("price_floor")
    const ceilRaw = searchParams.get("price_ceil")

    if (floorRaw && ceilRaw) {
      const floor = parsePrice(floorRaw)
      const ceil = parsePrice(ceilRaw)

      if (floor != null && ceil != null && floor < ceil) {
        setPriceBounds({ min: floor, max: ceil })

        const minRaw = searchParams.get("min_price")
        const maxRaw = searchParams.get("max_price")
        const urlMin = minRaw ? parsePrice(minRaw) : null
        const urlMax = maxRaw ? parsePrice(maxRaw) : null

        setMinPrice(
          urlMin != null ? Math.max(roundPrice(urlMin), floor) : floor
        )
        setMaxPrice(urlMax != null ? Math.min(roundPrice(urlMax), ceil) : ceil)
        return
      }
    }

    const facetMin = priceFacet?.stats?.min
    const facetMax = priceFacet?.stats?.max

    if (
      typeof facetMin === "number" &&
      typeof facetMax === "number" &&
      facetMin < facetMax
    ) {
      setPriceBounds({ min: facetMin, max: facetMax })

      setMinPrice(facetMin)
      setMaxPrice(facetMax)

      const p = new URLSearchParams(searchParams.toString())
      p.set("price_floor", facetMin.toFixed(2))
      p.set("price_ceil", facetMax.toFixed(2))
      router.replace(`?${p.toString()}`, { scroll: false })
    }
  }, [priceFacet, priceBounds, searchParams])

  const absoluteMin = priceBounds?.min ?? 0
  const absoluteMax = priceBounds?.max ?? 0
  const showPriceFilter = priceBounds != null && absoluteMin < absoluteMax

  useEffect(() => {
    if (!priceBounds) return

    const minRaw = searchParams.get("min_price")
    const maxRaw = searchParams.get("max_price")

    const urlMin = minRaw ? parsePrice(minRaw) : null
    const urlMax = maxRaw ? parsePrice(maxRaw) : null

    setMinPrice(
      urlMin != null
        ? Math.max(roundPrice(urlMin), priceBounds.min)
        : priceBounds.min
    )
    setMaxPrice(
      urlMax != null
        ? Math.min(roundPrice(urlMax), priceBounds.max)
        : priceBounds.max
    )
  }, [searchParams, priceBounds])

  const excludeKeys = ["q", "page", "sortBy", "price_floor", "price_ceil"]
  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => !excludeKeys.includes(key)
  )

  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>(
    DEFAULT_OPEN.reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<string, boolean>)
  )

  const toggleAccordion = (key: string) => {
    setOpenFacets((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const clearFilters = (keepKeys: string[] = ["q"]) => {
    const newParams = new URLSearchParams()

    keepKeys.forEach((key) => {
      const value = searchParams.get(key)
      if (value) newParams.set(key, value)
    })

    setMinPrice(absoluteMin)
    setMaxPrice(absoluteMax)
    setPriceResetKey((k) => k + 1)
    setPriceBounds(null)

    router.push(`?${newParams.toString()}`)
  }

  const facetBlocks: React.ReactNode[] = []

  normalizedFacets.forEach((facet) => {
    if (facet.key === "price") return

    const node = renderFacet({
      facet,
      openFacets,
      searchParams,
      toggleAccordion,
      toggleFacet,
    })

    if (Array.isArray(node)) facetBlocks.push(...node)
    else if (node) facetBlocks.push(node)
  })

  if (showPriceFilter) {
    const priceBlock = renderPriceFacet({
      minPrice: minPrice!,
      maxPrice: maxPrice!,
      absoluteMin,
      absoluteMax,
      step: STEP,
      priceResetKey,
      formatPrice,
      onChange: (a, b) => {
        setMinPrice(a)
        setMaxPrice(b)
      },
      onFinalChange: (a, b) => {
        const p = new URLSearchParams(searchParams.toString())
        p.delete("page")
        p.set("min_price", roundPrice(a).toFixed(2))
        p.set("max_price", roundPrice(b).toFixed(2))
        if (priceBounds) {
          p.set("price_floor", priceBounds.min.toFixed(2))
          p.set("price_ceil", priceBounds.max.toFixed(2))
        }
        router.push(`?${p.toString()}`)
      },
    })

    if (priceBlock) {
      const categoryIndex = facetBlocks.findIndex((block: any) =>
        block.key?.includes("facet-categories_searchable")
      )

      if (categoryIndex !== -1) {
        facetBlocks.splice(categoryIndex + 1, 0, priceBlock)
      } else {
        facetBlocks.push(priceBlock)
      }
    }
  }

  return (
    <>
      <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0 lg:mt-[4%]">
        <div className="sticky top-6 relative">
          {hasFilters && (
            <button
              className="absolute -top-12 left-0 flex bg-tertiary text-black py-2 rounded-lg font-medium text-sm gap-1 px-2 items-center"
              onClick={() => clearFilters()}
            >
              <CloseRounded color={"none"} />
              {t("store.clearFilters")}
            </button>
          )}
          <div className="w-full max-w-[290px]">{facetBlocks}</div>
        </div>
      </aside>

      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-30 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between p-4 border-b border-gray-200 items-center bg-primary">
          <h4 className="text-white">{t("store.filters")}</h4>
          <button
            className="text-white text-2xl font-bold"
            onClick={() => setMobileOpen(false)}
          >
            <X />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full">{facetBlocks}</div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 flex gap-2">
          <button
            className="flex-1 bg-tertiary text-gray-700 py-3 rounded-lg font-medium text-sm px-1"
            onClick={() => clearFilters()}
          >
            Καθαρισμός φίλτρων
          </button>

          <button
            className="flex-1 bg-primary text-white py-3 rounded-lg font-medium text-sm px-1"
            onClick={() => setMobileOpen(false)}
          >
            {t("store.viewResults", { count })}
          </button>
        </div>
      </div>

      <button
        className="fixed bottom-5 right-5 bg-primary text-white p-4 rounded-full shadow-lg focus:outline-none transition block lg:hidden z-10"
        aria-label="Open Filters"
        onClick={() => setMobileOpen(true)}
      >
        <MobileFilter />
      </button>
    </>
  )
}

export default RefinementList
