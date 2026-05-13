"use client"

import { createContext, useContext } from "react"
import { CaptchaConfig } from "./types"

const CaptchaContext = createContext<CaptchaConfig | null>(null)

export function CaptchaProvider({
  config,
  children,
}: {
  config: CaptchaConfig | null
  children: React.ReactNode
}) {
  return (
    <CaptchaContext.Provider value={config}>{children}</CaptchaContext.Provider>
  )
}

export function useCaptchaConfig() {
  return useContext(CaptchaContext)
}
