import { Label } from "@medusajs/ui"
import React, { useImperativeHandle, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = {
  label: string
  name: string
  type?: string
  rows?: number
  required?: boolean
  placeholder?: string
  value?: string
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  className?: string
  autoComplete?: string
  [key: string]: any
}

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({ type = "text", name, label, required, rows, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [showPassword, setShowPassword] = useState(false)

  useImperativeHandle(ref, () => {
    if (type === "textarea") {
      return textareaRef.current as HTMLTextAreaElement
    }
    return inputRef.current as HTMLInputElement
  })

  const actualType =
    type === "password" ? (showPassword ? "text" : "password") : type

  const isTextarea = type === "textarea"

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-secondary text-[16px]" htmlFor={name}>
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>

      <div className="relative">
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            required={required}
            ref={textareaRef}
            rows={rows || 4}
            className="w-full px-4 py-3 border border-primary2 text-primary2 focus:outline-none focus:ring-2 focus:ring-primary2/40 resize-none "
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={actualType}
            required={required}
            ref={inputRef}
            className="w-full px-4 py-3 border border-primary2 text-primary2 focus:outline-none focus:ring-2 focus:ring-primary2/40 bg-white"
            {...props}
          />
        )}

        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-[11px] text-secondary"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        )}
      </div>
    </div>
  )
})

Input.displayName = "Input"

export default Input
