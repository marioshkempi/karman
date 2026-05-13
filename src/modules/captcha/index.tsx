"use client"

import React, {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { CaptchaConfig } from "./types"

declare global {
  interface Window {
    turnstile: any
    onTurnstileLoad: () => void
  }
}

export type CaptchaWidgetRef = {
  reset: () => void
  execute: () => void
}

type CaptchaWidgetProps = {
  config: CaptchaConfig | null
  formType: string
  onVerify: (token: string | null) => void
}

const CaptchaWidget = forwardRef<CaptchaWidgetRef, CaptchaWidgetProps>(
  ({ config, formType, onVerify }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const turnstileContainerRef = useRef<HTMLDivElement>(null)
    const turnstileWidgetId = useRef<string | null>(null)

    const isProtected =
      config?.enabled && config.protected_forms?.includes(formType)

    const reset = useCallback(() => {
      if (!config) return

      if (config.version === "turnstile") {
        if (window.turnstile && turnstileWidgetId.current) {
          window.turnstile.reset(turnstileWidgetId.current)
        }
      } else {
        recaptchaRef.current?.reset()
      }
      onVerify(null)
    }, [config, onVerify])

    const execute = useCallback(() => {
      if (!config) return

      if (config.version === "v2_invisible") {
        recaptchaRef.current?.execute()
      } else if (config.version === "v3") {
        recaptchaRef.current?.execute()
      } else if (config.version === "turnstile") {
        if (window.turnstile && turnstileWidgetId.current) {
          window.turnstile.execute(turnstileWidgetId.current)
        }
      }
    }, [config])

    useImperativeHandle(ref, () => ({ reset, execute }), [reset, execute])

    // Turnstile script loader
    useEffect(() => {
      if (!isProtected || config?.version !== "turnstile") return
      if (document.getElementById("turnstile-script")) return

      const script = document.createElement("script")
      script.id = "turnstile-script"
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
      script.async = true

      window.onTurnstileLoad = () => {
        if (!turnstileContainerRef.current || turnstileWidgetId.current) return
        turnstileWidgetId.current = window.turnstile.render(
          turnstileContainerRef.current,
          {
            sitekey: config.site_key,
            callback: (token: string) => onVerify(token),
            "expired-callback": () => onVerify(null),
            "error-callback": () => onVerify(null),
          }
        )
      }

      document.head.appendChild(script)

      return () => {
        if (turnstileWidgetId.current && window.turnstile) {
          window.turnstile.remove(turnstileWidgetId.current)
          turnstileWidgetId.current = null
        }
      }
    }, [isProtected, config?.version, config?.site_key, onVerify])

    // If Turnstile script already loaded (e.g. navigating between pages)
    useEffect(() => {
      if (!isProtected || config?.version !== "turnstile") return
      if (
        !window.turnstile ||
        !turnstileContainerRef.current ||
        turnstileWidgetId.current
      )
        return

      turnstileWidgetId.current = window.turnstile.render(
        turnstileContainerRef.current,
        {
          sitekey: config.site_key,
          callback: (token: string) => onVerify(token),
          "expired-callback": () => onVerify(null),
          "error-callback": () => onVerify(null),
        }
      )
    }, [isProtected, config?.version, config?.site_key, onVerify])

    if (!isProtected || !config) return null

    // Turnstile
    if (config.version === "turnstile") {
      return <div ref={turnstileContainerRef} />
    }

    // reCAPTCHA v3 — invisible, auto-execute
    if (config.version === "v3") {
      return (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={config.site_key}
          size="invisible"
          badge="bottomright"
          onChange={(token) => onVerify(token)}
          onExpired={() => onVerify(null)}
          onErrored={() => onVerify(null)}
        />
      )
    }

    // reCAPTCHA v2 invisible
    if (config.version === "v2_invisible") {
      return (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={config.site_key}
          size="invisible"
          onChange={(token) => onVerify(token)}
          onExpired={() => onVerify(null)}
          onErrored={() => onVerify(null)}
        />
      )
    }

    // reCAPTCHA v2 checkbox (default)
    return (
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={config.site_key}
        onChange={(token) => onVerify(token || null)}
        onExpired={() => onVerify(null)}
        onErrored={() => onVerify(null)}
      />
    )
  }
)

CaptchaWidget.displayName = "CaptchaWidget"

export default CaptchaWidget
