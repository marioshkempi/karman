"use client"

import { Fragment } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import ChevronDown from "@modules/common/icons/chevron-down"

export type SortOptions =
  | "price_asc"
  | "price_desc"
  | "created_at"
  | "title_asc"
  | "title_desc"

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Νεότερα Προϊόντα" },
  { value: "price_asc", label: "Τιμή: Χαμηλή → Υψηλή" },
  { value: "price_desc", label: "Τιμή: Υψηλή → Χαμηλή" },
  { value: "title_asc", label: "Τίτλος: Α → Ω" },
  { value: "title_desc", label: "Τίτλος: Ω → Α" },
]

type SortProductsProps = {
  "data-testid"?: string
}

export default function SortProducts({
  "data-testid": dataTestId,
}: SortProductsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortBy: SortOptions =
    (searchParams.get("sortBy") as SortOptions) || "created_at"

  const handleChange = (value: SortOptions) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div
      data-testid={dataTestId}
      className="flex items-center gap-2  md:justify-self-end"
    >
      <label
        htmlFor="sort-products"
        className="whitespace-nowrap text-sm hidden md:block"
      >
        Ταξινόμηση:
      </label>

      <Listbox value={sortBy} onChange={handleChange}>
        <div className="relative w-[100%] md:w-[220px]">
          <Listbox.Button className="relative w-full cursor-pointer rounded border px-3 py-2 text-left bg-white focus:outline-none text-sm">
            <span className="block truncate">
              {sortOptions.find((o) => o.value === sortBy)?.label}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown size={16} />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow border z-[999] focus:outline-none">
              {sortOptions.map((option) => (
                <Listbox.Option key={option.value} value={option.value}>
                  {({ active, selected }) => (
                    <span
                      className={`hover:bg-tertiary transition-colors block cursor-pointer select-none py-2 px-3 text-sm ${
                        active ? "bg-gray-100" : ""
                      } ${
                        selected
                          ? "bg-primary text-white hover:bg-primary"
                          : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
