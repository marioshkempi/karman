// components/ui/ErrorBanner.tsx
"use client"

import { useSearchParams } from "next/navigation"

import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react"
import { getErrorMessage } from "@lib/util/error-mapping"

export default function ErrorBanner() {
  const searchParams = useSearchParams()

  const errorType = searchParams.get("error") // e.g., "bank_error"
  const source = searchParams.get("error_source") // e.g., "piraeus"
  const code = searchParams.get("resultCode") // e.g., "1048"

  if (!errorType) return null

  const { title, message, variant } = getErrorMessage(source, code)

  const config = {
    error: {
      styles: "border-red text-red-800",
      icon: <XCircle className="h-5 w-5 text-red" />,
    },
    warning: {
      styles: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    },
    info: {
      styles: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info className="h-5 w-5 text-blue-600" />,
    },
  }

  const { styles, icon } = config[variant]

  return (
    <div className={`my-4 flex gap-3 rounded-lg border p-4 shadow-sm animate-in fade-in slide-in-from-top-2 ${styles}`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1">
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed opacity-90">{message}</p>

        {code && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] bg-white/50 px-1.5 py-0.5 rounded border border-current/10 uppercase">
              Code: {code}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}