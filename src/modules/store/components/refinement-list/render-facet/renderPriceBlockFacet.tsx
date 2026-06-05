import React from "react"
import { Range, getTrackBackground } from "react-range"

interface RenderPriceFacetParams {
  minPrice: number
  maxPrice: number
  absoluteMin?: number
  absoluteMax?: number
  step: number
  priceResetKey: number
  formatPrice: (v: number | null) => string
  onChange: (min: number, max: number) => void
  onFinalChange: (min: number, max: number) => void
}

const TRACK_COLORS = ["#ffffff", "var(--color-primary, #999933)", "#ffffff"]

export function renderPriceFacet({
  minPrice,
  maxPrice,
  absoluteMin,
  absoluteMax,
  step,
  priceResetKey,
  formatPrice,
  onChange,
  onFinalChange,
}: RenderPriceFacetParams): React.ReactNode | null {
  if (
    typeof absoluteMin !== "number" ||
    typeof absoluteMax !== "number" ||
    absoluteMin >= absoluteMax
  ) {
    return null
  }

  const trackBackground = getTrackBackground({
    values: [minPrice, maxPrice],
    colors: TRACK_COLORS,
    min: absoluteMin,
    max: absoluteMax,
  })

  return (
    <div key="facet-price" className="mb-4 bg-white">
      <div className="py-3 border-b border-gray-200 text-[14px] font-semibold text-gray-900">
        Τιμή
      </div>

      <div className="py-3">
        <Range
          key={priceResetKey}
          values={[minPrice, maxPrice]}
          step={step}
          min={absoluteMin}
          max={absoluteMax}
          onChange={([min, max]) => onChange(min, max)}
          onFinalChange={([min, max]) => onFinalChange(min, max)}
          renderTrack={({ props: { key, ...trackProps }, children }) => (
            <div
              key={key}
              {...trackProps}
              className="relative py-[2px] w-full rounded-full h-1.5 bg-gray-200"
              style={{ background: trackBackground }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props: { key, style, ...thumbProps } }) => (
            <div
              key={key}
              {...thumbProps}
              className="h-4 w-4 bg-primary rounded-full shadow-md border-2 border-white"
              style={{ ...style, transform: "translateX(-50%)" }}
            />
          )}
        />

        <div className="flex justify-between text-sm mt-3 text-gray-600">
          <span>{formatPrice(minPrice)} €</span>
          <span>{formatPrice(maxPrice)} €</span>
        </div>
      </div>
    </div>
  )
}
