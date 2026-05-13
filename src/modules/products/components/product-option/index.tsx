import React, { useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Tooltip } from "@medusajs/ui"

type ColorSwatch = {
  id: string
  name: string
  hex_code: string
  image_url: string | null
  position: number
}

type OptionValueWithSwatch = HttpTypes.StoreProductOptionValue & {
  color_swatch?: ColorSwatch | null
}

type OptionWithSwatch = Omit<HttpTypes.StoreProductOption, "values"> & {
  values?: OptionValueWithSwatch[]
}

type ProductOptionsProps = {
  options: OptionWithSwatch[]
  variants: HttpTypes.StoreProductVariant[]
  selectedVariant?: HttpTypes.StoreProductVariant | null
  selectedOptions: Record<string, string>
  onOptionChange: (optionId: string, value: string) => void
  disabled?: boolean
}

const isLightColor = (hex: string | null): boolean => {
  if (!hex) return false
  let c = hex.replace("#", "").trim()
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]
  }
  if (c.length !== 6) return false
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false
  return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

const SwatchButton = ({
  value,
  swatch,
  isSelected,
  disabled,
  onClick,
}: {
  value: string
  swatch: ColorSwatch | null | undefined
  isSelected: boolean
  disabled: boolean
  onClick: () => void
}) => {
  const hex = swatch?.hex_code || "#ccc"
  const isLight = isLightColor(hex)

  return (
    <Tooltip content={swatch?.name || value}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative w-8 h-8 rounded-full flex items-center justify-center !p-0
          transition-all duration-200
          disabled:opacity-40 disabled:cursor-not-allowed
          ${isSelected ? "border-2 border-black p-[2px]" : "hover:scale-105"}
        `}
      >
        {swatch?.image_url ? (
          <img
            src={swatch.image_url}
            alt={swatch.name || value}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span
            className="block w-full h-full rounded-full"
            style={{ backgroundColor: hex }}
          />
        )}

        {isSelected && (
          <svg
            className={`absolute w-3.5 h-3.5 ${
              isLight || swatch?.image_url ? "text-gray-700" : "text-white"
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
      </button>
    </Tooltip>
  )
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  options,
  variants,
  selectedVariant,
  selectedOptions,
  onOptionChange,
  disabled = false,
}) => {
  if (!options || options.length === 0) return null

  const filteredOptions = options.filter(
    (option) => option.title?.toLowerCase() !== "default option"
  )

  if (filteredOptions.length === 0) return null

  const hasSwatches = (option: OptionWithSwatch) =>
    option.values?.some((v) => v.color_swatch) ?? false

  const effectiveSelected = useMemo(() => {
    if (!selectedVariant?.options?.length) return selectedOptions

    const fromVariant: Record<string, string> = {}
    for (const opt of selectedVariant.options) {
      if (opt.option_id && opt.value) {
        fromVariant[opt.option_id] = opt.value
      }
    }

    return { ...selectedOptions, ...fromVariant }
  }, [selectedVariant, selectedOptions])

  const availableValues = useMemo(() => {
    const map: Record<string, Set<string>> = {}

    for (const option of filteredOptions) {
      const otherSelections = Object.entries(effectiveSelected).filter(
        ([optId, val]) => optId !== option.id && val
      )

      const validValues = new Set<string>()

      for (const value of option.values || []) {
        const hasVariant = variants.some((variant) => {
          const variantOptions = variant.options || []

          const matchesCurrent = variantOptions.some(
            (vo) => vo.option_id === option.id && vo.value === value.value
          )
          if (!matchesCurrent) return false

          return otherSelections.every(([optId, optVal]) =>
            variantOptions.some(
              (vo) => vo.option_id === optId && vo.value === optVal
            )
          )
        })

        if (hasVariant) {
          validValues.add(value.value)
        }
      }

      map[option.id] = validValues
    }

    return map
  }, [filteredOptions, variants, effectiveSelected])

  return (
    <div className="flex flex-col gap-5">
      {filteredOptions.map((option) => {
        const isSwatchOption = hasSwatches(option)
        const selectedValue = effectiveSelected[option.id]
        const valid = availableValues[option.id] || new Set()

        const visibleValues = (option.values || []).filter((v) =>
          valid.has(v.value)
        )

        if (visibleValues.length === 0) return null

        return (
          <div key={option.id}>
            {isSwatchOption ? (
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {visibleValues.map((value) => (
                  <SwatchButton
                    key={value.value}
                    value={value.value}
                    swatch={value.color_swatch}
                    isSelected={selectedValue === value.value}
                    disabled={disabled}
                    onClick={() => onOptionChange(option.id, value.value)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {visibleValues.map((value) => (
                  <button
                    key={value.value}
                    onClick={() => onOptionChange(option.id, value.value)}
                    disabled={disabled}
                    className={`
                      text-sm py-1.5 px-4 rounded border transition-colors
                      disabled:opacity-40 disabled:cursor-not-allowed
                      ${
                        selectedValue === value.value
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }
                    `}
                  >
                    {value.value}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              {/*<span className="text-sm font-semibold text-gray-800">*/}
              {/*  {option.title}:*/}
              {/*</span>*/}
              <span className="text-sm text-gray-500">
                {selectedValue || "Επιλέξτε"}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductOptions
