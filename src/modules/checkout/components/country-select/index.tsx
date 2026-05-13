import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { HttpTypes } from "@medusajs/types"

type Props = NativeSelectProps & {
  region?: HttpTypes.StoreRegion
  label?: string
}

const CountrySelect = forwardRef<HTMLSelectElement, Props>(
  (
    {
      placeholder = "Χώρα",
      region,
      defaultValue,
      label = "Χώρα",
      required,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLSelectElement>(null)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    const countryOptions = useMemo(() => {
      if (!region) {
        return []
      }

      return region.countries?.map((country) => ({
        value: country.iso_2,
        label: country.display_name,
      }))
    }, [region])

    return (
      <div className="flex flex-col gap-2 w-full">
        {/* LABEL */}
        <label className="text-secondary text-[16px]">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>

        {/* SELECT */}
        <NativeSelect
          ref={innerRef}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="
            w-full
            py-[2px]
            bg-white
            text-primary2
            border
            border-primary2
            rounded-md
            focus:outline-none
            focus:ring-2
            focus:ring-primary2/40
          "
          {...props}
        >
          {/* Placeholder option */}
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {countryOptions?.map(({ value, label }, index) => (
            <option key={index} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
      </div>
    )
  }
)

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
