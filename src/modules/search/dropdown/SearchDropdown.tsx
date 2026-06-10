"use client"

import React, { useEffect, useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRightIcon } from "lucide-react"
import PreviewPrice from "@modules/products/components/product-preview/price"
import { useTranslations } from "next-intl"

interface Hit {
  document: any
  highlight?: any
}

interface CollectionResult {
  request_params?: { collection_name?: string }
  hits?: Hit[]
  found?: number
}

interface SearchDropdownProps {
  data?: {
    results?: CollectionResult[]
    erpPrices?: Record<string, any>
  } | null
  query: string
  setQuery: (q: string) => void
  setOpen: (open: boolean) => void
  open: boolean
}

function findCollectionResult(
  results: CollectionResult[] | undefined,
  collectionHint: string
) {
  if (!Array.isArray(results)) return { hits: [], found: 0 }

  const valid = results.filter((r) => r?.request_params)

  const match =
    valid.find((r) => r?.request_params?.collection_name === collectionHint) ??
    valid.find((r) =>
      r?.request_params?.collection_name
        ?.toLowerCase()
        .includes(collectionHint.toLowerCase())
    )

  return { hits: match?.hits ?? [], found: match?.found ?? 0 }
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  data,
  query,
  setQuery,
  setOpen,
  open,
}) => {
  const t = useTranslations()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const results = data?.results
  const erpPrices = data?.erpPrices ?? {}

  const { hits: products, found: productsFound } = findCollectionResult(
    results,
    "products"
  )
  const { hits: brands } = findCollectionResult(results, "brands")
  const { hits: categories } = findCollectionResult(results, "categories")

  const validResults = results?.filter((r) => r?.request_params) ?? []
  const noResults =
    validResults.length === 0 ||
    validResults.every((r) => (r?.hits?.length ?? 0) === 0)
  const hasHits = validResults.some((r) => (r?.hits?.length ?? 0) > 0)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setOpen])

  if (!open) return null

  if (noResults) {
    return (
      <div
        ref={dropdownRef}
        className="absolute justify-self-center left-1/2 right-1/2 mt-0 w-[800px] bg-white rounded-[10px] shadow-lg border border-primary/30 z-[100] p-2 flex gap-4"
      >
        {t("search.noResults")}
      </div>
    )
  }

  if (!hasHits) return null

  return (
    <div id="search-dropdown">
      <div
        ref={dropdownRef}
        className="absolute left-1/2 top-full -translate-x-1/2 w-[100vw] md:w-[906px] bg-white rounded-[10px] shadow-xl border border-primary/30 z-[100] flex flex-col md:flex-row p-0 overflow-visible md:overflow-hidden"
      >
        <div className="w-full md:w-[70%] bg-white p-4 relative pb-0">
          {products.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-black flex items-center gap-2 mb-3 uppercase">
                {t("navigation.products")}
                <span className="bg-tertiary text-secondary text-xs px-2 py-1 rounded-full">
                  {productsFound}
                </span>
              </h4>

              <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {products.map((h) => (
                  <li
                    key={h.document?.id || h.document?.sku_searchable}
                    className="flex items-center cursor-pointer hover:bg-primary/10 p-2 border-b last:border-b-0 border-lightBorder/30 transition-all duration-200"
                  >
                    <LocalizedClientLink
                      href={`/${h.document?.handle}`}
                      className="flex w-full"
                      onClick={() => setOpen(false)}
                    >
                      <img
                        src={h.document?.thumbnail}
                        alt={h.document?.title}
                        className="w-14 h-14 object-cover rounded-md mr-3"
                      />
                      <div className="flex flex-col">
                        <span
                          className="text-sm font-medium text-secondary"
                          dangerouslySetInnerHTML={{
                            __html:
                              h.highlight?.title?.snippet || h.document?.title,
                          }}
                        />
                        <span className="text-xs mt-1 !text-left">
                          <PreviewPrice
                            originalPrice={h.document?.price}
                            cubikPrice={erpPrices[h.document?.id] || null}
                            currency={h.document?.currency}
                            className="justify-start gap-2"
                          />
                        </span>
                      </div>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>

              <div className="text-center mt-3 w-full max-w-[570px] border-t pt-3 pb-3 border-lightBorder/30">
                <LocalizedClientLink
                  href={`/search?q=${query}`}
                  className="text-sm font-medium text-secondary flex justify-between items-center hover:text-primary transition-all duration-200"
                  onClick={() => setOpen(false)}
                >
                  <span className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 after:ease-out hover:after:w-full">
                    {t("search.showAllResults")}
                  </span>
                  <ChevronRightIcon className="inline-block w-6 h-6 ml-1 text-[#707070]" />
                </LocalizedClientLink>
              </div>
            </>
          )}
        </div>

        <div
          className="w-full md:w-[35%] bg-[#283882] text-white py-4 flex flex-col gap-6 [&>.searchDropdownSection:not(:last-child)]:border-b [&>.searchDropdownSection:not(:last-child)]:border-white/40 [&>.searchDropdownSection]:pb-4"
          style={{
            backgroundImage: "url('/search/car.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center right",
          }}
        >
          {categories.length > 0 && (
            <div className="searchDropdownSection">
              <div className="px-4">
                <h4 className="text-sm font-semibold mb-2 uppercase">
                  {t("navigation.categories")}
                </h4>
                <ul className="space-y-2">
                  {categories.slice(0, 5).map((h) => (
                    <li key={h.document?.id} className="ps-2">
                      <LocalizedClientLink
                        href={`/${h.document?.handle}`}
                        onClick={() => setOpen(false)}
                        className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-out hover:after:w-full text-sm"
                      >
                        {h.document?.name || h.document?.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {brands.length > 0 && (
            <div className="searchDropdownSection">
              <div className="px-4">
                <h4 className="text-sm font-semibold mb-2 uppercase">{t("search.brands")}</h4>
                <ul className="space-y-2 max-h-[200px] overflow-y-auto">
                  {brands.map((h) => (
                    <li key={h.document?.id} className="ps-2">
                      <LocalizedClientLink
                        href={`/brands/${h.document?.handle}`}
                        onClick={() => setOpen(false)}
                        className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-out hover:after:w-full text-sm"
                      >
                        {h.document?.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
