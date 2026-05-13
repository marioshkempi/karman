import React from "react"
import ChevronDown from "@modules/common/icons/chevron-down"
import CheckboxWithLabel from "@modules/common/components/checkbox"

interface RenderFacetParams {
  facet: any
  openFacets: Record<string, boolean>
  searchParams: URLSearchParams
  toggleAccordion: (key: string) => void
  toggleFacet: (facetName: string, value: string, checked: boolean) => void
}

const isLightColor = (hex: string | null): boolean => {
  if (!hex) return false

  let c = hex.replace("#", "").trim()

  // Handle 3-char hex: #FFF → FFFFFF
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]
  }

  if (c.length !== 6) return false

  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)

  if (isNaN(r) || isNaN(g) || isNaN(b)) return false

  // Perceived brightness (ITU-R BT.601)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 160
}

export function renderFacet({
  facet,
  openFacets,
  searchParams,
  toggleAccordion,
  toggleFacet,
}: RenderFacetParams): React.ReactNode | React.ReactNode[] | null {
  if (facet.key === "price") return null

  if (facet.key === "options_facet") {
    const groups: Record<string, any[]> = {}

    facet.items.forEach((item: any) => {
      const rawVal = item.value ?? ""
      const split = rawVal.split(":")
      const group = split.length > 1 ? split[0].trim() || "Other" : "Other"
      const val =
        split.length > 1 ? split.slice(1).join(":").trim() : rawVal.trim()

      const parts = val.split("|")
      const label = parts[0]
      const hex = parts[1] || null
      const imageUrl = parts[2] || null

      if (!groups[group]) groups[group] = []
      groups[group].push({
        value: label,
        fullValue: rawVal,
        hex,
        imageUrl,
        count: item.count,
      })
    })

    const blocks: React.ReactNode[] = []

    Object.entries(groups).forEach(([groupName, options]) => {
      const isColorGroup = options.some((o: any) => o.hex)
      const accordionKey = `options_facet_${groupName}`

      blocks.push(
        <div
          key={`options-group-${groupName}`}
          className="mb-4 rounded-lg overflow-auto"
        >
          <button
            type="button"
            onClick={() => toggleAccordion(accordionKey)}
            className="
            w-full flex justify-between items-center
            px-2 py-3
            text-[15px] font-bold uppercase tracking-wider
            bg-primary text-white
            transition-colors duration-200
          "
          >
            <span>{groupName}</span>
            <ChevronDown
              size={16}
              className={`
              transition-transform duration-300 ease-in-out
              ${openFacets[accordionKey] ? "rotate-180" : "rotate-0"}
            `}
            />
          </button>

          <div
            className={`
            overflow-auto
            transition-all duration-300 ease-in-out
            ${
              openFacets[accordionKey]
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
          >
            <div className="px-1 py-3 bg-white">
              {isColorGroup ? (
                <div className="flex flex-wrap gap-x-4 gap-y-3">
                  {options.map((option: any, idx: number) => {
                    const isChecked = searchParams
                      .getAll(facet.key)
                      .includes(option.fullValue)

                    const isLight = isLightColor(option.hex)

                    return (
                      <button
                        key={`options-${groupName}-${option.fullValue}-${idx}`}
                        onClick={() =>
                          toggleFacet(facet.key, option.fullValue, !isChecked)
                        }
                        title={`${option.value} (${option.count})`}
                        className="flex flex-col items-center gap-1.5 group"
                      >
                        <div
                          className={`!p-0
                          relative w-10 h-10 rounded-full flex items-center justify-center
                          transition-all duration-200
                          ${
                            isChecked
                              ? "border-2 border-black"
                              : "group-hover:scale-105"
                          }
                        `}
                        >
                          {option.imageUrl ? (
                            <img
                              src={option.imageUrl}
                              alt={option.value}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span
                              className="block w-full h-full rounded-full"
                              style={{ backgroundColor: option.hex || "#ccc" }}
                            />
                          )}

                          {isChecked && (
                            <svg
                              className={`absolute w-4 h-4 ${
                                isLight || option.imageUrl
                                  ? "text-gray-700"
                                  : "text-white"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>

                        <span className="text-[11px] text-gray-600 leading-tight text-center max-w-[52px] truncate">
                          {option.value}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {options.map((option: any, idx: number) => {
                    const isChecked = searchParams
                      .getAll(facet.key)
                      .includes(option.fullValue)

                    return (
                      <div
                        key={`options-${groupName}-${option.fullValue}-${idx}`}
                        className="flex items-center justify-between gap-2 text-[13px]"
                      >
                        <div className="flex items-center gap-2">
                          <CheckboxWithLabel
                            checked={isChecked}
                            label={option.value}
                            onChange={(checked: boolean) =>
                              toggleFacet(facet.key, option.fullValue, checked)
                            }
                          />
                        </div>
                        <span className="text-[12px] text-gray-500">
                          ({option.count ?? 0})
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    })

    return blocks
  }

  if (facet.key === "features") {
    const groups: Record<string, any[]> = {}

    facet.items.forEach((item: any) => {
      const rawVal = item.value ?? ""
      const split = rawVal.split(":")
      const group = split.length > 1 ? split[0].trim() || "Other" : "Other"
      const val =
        split.length > 1 ? split.slice(1).join(":").trim() : rawVal.trim()

      if (!groups[group]) groups[group] = []
      groups[group].push({
        value: val || rawVal,
        fullValue: rawVal,
        count: item.count,
      })
    })

    const blocks: React.ReactNode[] = []

    Object.entries(groups).forEach(([groupName, options]) => {
      blocks.push(
        <div key={`features-group-${groupName}`} className="mb-4">
          <div className="bg-primary text-white px-4 py-2 text-[17px] font-bold uppercase rounded-lg">
            {groupName}
          </div>
          <div className="px-1 py-3 space-y-2">
            {options.map((option: any, idx: number) => {
              const isChecked = searchParams
                .getAll(facet.key)
                .includes(option.fullValue)

              return (
                <div
                  key={`features-${groupName}-${option.fullValue}-${idx}`}
                  className="flex items-center justify-between gap-2 text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <CheckboxWithLabel
                      checked={isChecked}
                      label={option.value}
                      onChange={(checked: boolean) =>
                        toggleFacet(facet.key, option.fullValue, checked)
                      }
                    />
                  </div>

                  <span className="text-[12px] text-gray-500">
                    ({option.count ?? 0})
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )
    })

    return blocks
  }

  return (
    <div key={`facet-${facet.key}`} className="mb-4 rounded-lg overflow-auto">
      <button
        type="button"
        onClick={() => toggleAccordion(facet.key)}
        className="
          w-full flex justify-between items-center
          px-2 py-3
          text-[15px] font-bold uppercase tracking-wider
          bg-primary text-white
          transition-colors duration-200
        "
      >
        <span>{facet.title}</span>
        <ChevronDown
          size={16}
          className={`
            transition-transform duration-300 ease-in-out
            ${openFacets[facet.key] ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      <div
        className={`
          overflow-auto
          transition-all duration-300 ease-in-out
          ${
            openFacets[facet.key]
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div className="px-1 py-3 space-y-2 bg-white">
          {facet.items.map((option: any, idx: number) => {
            const value = option.value
            const count = option.count
            const isChecked = searchParams.getAll(facet.key).includes(value)

            return (
              <div
                key={`${facet.key}-${value}-${idx}`}
                className="flex items-center justify-between gap-2 text-[15px]"
              >
                <div className="flex items-center gap-2">
                  <CheckboxWithLabel
                    checked={isChecked}
                    label={value}
                    onChange={(checked: boolean) =>
                      toggleFacet(facet.key, value, checked)
                    }
                  />
                </div>

                <span className="text-[12px] text-gray-500">
                  ({count ?? 0})
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
