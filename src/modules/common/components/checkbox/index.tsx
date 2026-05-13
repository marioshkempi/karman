"use client"

import React from "react"
import { Checkbox, Field, Label } from "@headlessui/react"
import Checkmark from "@modules/common/icons/checkMark"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CheckboxProps = {
  checked?: boolean
  onChange?: any
  label: string
  name?: string
  "data-testid"?: string
  disabled?: boolean
  required?: boolean
  labelLink?: {
    href: string
    text: string
  }
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  name,
  disabled = false,
  "data-testid": dataTestId,
  required = false,
  labelLink,
}) => {
  // @ts-ignore
  return (
    <Field className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onChange={onChange}
        name={name}
        disabled={disabled}
        data-testid={dataTestId}
        className={`
          group block size-4 rounded border
          ${checked ? "bg-primary border-primary" : "bg-white border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <Checkmark
          color="white"
          className={`transition-opacity duration-150 ${
            checked ? "opacity-100" : "opacity-0"
          }`}
        />
      </Checkbox>

      <Label className="cursor-pointer select-none">
        {label}
        {labelLink && (
          <>
            {" "}
            <LocalizedClientLink href={labelLink.href} className="underline">
              {labelLink.text}
            </LocalizedClientLink>
          </>
        )}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
    </Field>
  )
}

export default CheckboxWithLabel
