"use client"

import React from "react"

type PopupStyle = {
  overlayColor?: string
  overlayBlur?: string
  align?: "center" | "top" | "bottom"
  maxWidth?: string
  padding?: string
  background?: string
  backgroundImage?: string
  backgroundOverlayOpacity?: string
  color?: string
  borderRadius?: string
  boxShadow?: string
  scrollbarSize?: string
  scrollbarThumbColor?: string
  scrollbarTrackColor?: string
  scrollbarThumbRadius?: string
  closeButtonColor?: string
  closeButtonBackground?: string
  closeButtonFontSize?: string
  closeButtonPadding?: string
  closeButtonBorderRadius?: string
}

export type RegisteredPopup = {
  id: string
  name: string
  Content: React.ComponentType<any>
  style: PopupStyle
}

// ─────────────────────────────────────────────────────────────
// Global registry store (so popups don't "disappear" when the
// PopupDefinition block isn't mounted in the current view)
// ─────────────────────────────────────────────────────────────
const _popupMap = new Map<string, RegisteredPopup>()
let _registeredPopups: RegisteredPopup[] = []
const _listeners = new Set<() => void>()

function recomputeList() {
  _registeredPopups = Array.from(_popupMap.values())
}

function emit() {
  _listeners.forEach((l) => l())
}

/** Replace registry entirely (bulk update). */
export function setRegisteredPopups(popups: RegisteredPopup[]) {
  _popupMap.clear()
  for (const p of Array.isArray(popups) ? popups : []) {
    if (p?.id) _popupMap.set(p.id, p)
  }
  recomputeList()
  emit()
}

/** Register or update a single popup by id. */
export function registerPopup(popup: RegisteredPopup) {
  if (!popup?.id) return
  _popupMap.set(popup.id, popup)
  recomputeList()
  emit()
}

/** Remove popup by id (e.g. when definition unmounts). */
export function unregisterPopup(id: string) {
  if (!id) return
  _popupMap.delete(id)
  recomputeList()
  emit()
}

function subscribe(listener: () => void) {
  _listeners.add(listener)
  return () => _listeners.delete(listener)
}

function getSnapshot() {
  return _registeredPopups
}

export function useRegisteredPopups() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

type PopupRuntimeValue = {
  openPopup: (id: string) => void
  closePopup: () => void
  isOpen: boolean
  activePopupId: string | null
}

const PopupRuntimeContext = React.createContext<PopupRuntimeValue | null>(null)

export function usePopupRuntime() {
  const ctx = React.useContext(PopupRuntimeContext)
  if (!ctx) throw new Error("usePopupRuntime must be used within PopupProvider")
  return ctx
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0
  return Math.min(1, Math.max(0, n))
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "").trim()
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    if ([r, g, b].some((v) => Number.isNaN(v))) return null
    return { r, g, b }
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    if ([r, g, b].some((v) => Number.isNaN(v))) return null
    return { r, g, b }
  }
  return null
}

function toRgba(color: string, alpha: number) {
  const a = clamp01(alpha)
  const c = String(color || "").trim()
  if (!c) return `rgba(255,255,255,${a})`
  if (c.startsWith("rgba(")) {
    const m = c.match(
      /^rgba\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)$/i
    )
    if (m) return `rgba(${m[1]},${m[2]},${m[3]},${a})`
    return c
  }
  if (c.startsWith("rgb(")) {
    const m = c.match(/^rgb\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)$/i)
    if (m) return `rgba(${m[1]},${m[2]},${m[3]},${a})`
    return c
  }
  if (c.startsWith("#")) {
    const rgb = hexToRgb(c)
    if (rgb) return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`
  }
  return c
}

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const popups = useRegisteredPopups()
  const [activePopupId, setActivePopupId] = React.useState<string | null>(null)

  const activePopup = React.useMemo(() => {
    if (!activePopupId) return null
    return popups.find((p) => p.id === activePopupId) || null
  }, [activePopupId, popups])

  const closePopup = React.useCallback(() => setActivePopupId(null), [])
  const openPopup = React.useCallback((id: string) => {
    if (!id) return
    setActivePopupId(id)
  }, [])

  const isOpen = Boolean(activePopupId && activePopup)

  React.useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, closePopup])

  React.useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const runtimeValue = React.useMemo<PopupRuntimeValue>(
    () => ({ openPopup, closePopup, isOpen, activePopupId }),
    [openPopup, closePopup, isOpen, activePopupId]
  )

  const panelClass = React.useMemo(() => {
    if (!activePopup?.id) return ""
    return `puck-popup-panel-${String(activePopup.id).replace(/[^a-zA-Z0-9-_]/g, "")}`
  }, [activePopup?.id])

  const scrollbarCss = React.useMemo(() => {
    if (!activePopup?.style) return ""
    const size = String(activePopup.style.scrollbarSize || "").trim()
    const thumb = String(activePopup.style.scrollbarThumbColor || "").trim()
    const track = String(activePopup.style.scrollbarTrackColor || "").trim()
    const radius = String(activePopup.style.scrollbarThumbRadius || "").trim()

    if (!panelClass) return ""
    if (!size && !thumb && !track && !radius) return ""

    const parts: string[] = []

    // Firefox
    if (thumb || track) {
      parts.push(`.${panelClass}{scrollbar-color:${thumb || "auto"} ${track || "auto"};}`)
    }
    if (size) {
      const ff = ["auto", "thin", "none"].includes(size) ? size : "thin"
      parts.push(`.${panelClass}{scrollbar-width:${ff};}`)
    }

    // WebKit (Chrome/Edge/Safari)
    if (size) {
      parts.push(`.${panelClass}::-webkit-scrollbar{width:${size};height:${size};}`)
    }
    if (track) {
      parts.push(`.${panelClass}::-webkit-scrollbar-track{background:${track};}`)
    }
    if (thumb || radius) {
      const r = radius || "999px"
      parts.push(
        `.${panelClass}::-webkit-scrollbar-thumb{background:${thumb || "rgba(0,0,0,0.35)"};border-radius:${r};}`
      )
    }

    return parts.join("\n")
  }, [activePopup?.style, panelClass])

  const modal = !isOpen || !activePopup ? null : (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closePopup()
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: activePopup.style.overlayColor || "rgba(0,0,0,0.55)",
        backdropFilter: activePopup.style.overlayBlur ? `blur(${activePopup.style.overlayBlur})` : undefined,
        display: "flex",
        alignItems:
          activePopup.style.align === "top"
            ? "flex-start"
            : activePopup.style.align === "bottom"
              ? "flex-end"
              : "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        className={panelClass || undefined}
        style={{
          width: "100%",
          maxWidth: activePopup.style.maxWidth || "860px",
          background: activePopup.style.backgroundImage ? "transparent" : activePopup.style.background || "#fff",
          color: activePopup.style.color || "#111",
          borderRadius: activePopup.style.borderRadius || "14px",
          boxShadow: activePopup.style.boxShadow || "0 30px 80px rgba(0,0,0,0.35)",
          padding: activePopup.style.padding || "24px",
          boxSizing: "border-box",
          maxHeight: "85vh",
          overflow: "auto",
          position: "relative",
          backgroundImage: activePopup.style.backgroundImage
            ? `linear-gradient(${toRgba(
                activePopup.style.background || "#ffffff",
                Number(activePopup.style.backgroundOverlayOpacity || "0.35")
              )},${toRgba(
                activePopup.style.background || "#ffffff",
                Number(activePopup.style.backgroundOverlayOpacity || "0.35")
              )}),url(${activePopup.style.backgroundImage})`
            : undefined,
          backgroundSize: activePopup.style.backgroundImage ? "cover" : undefined,
          backgroundPosition: activePopup.style.backgroundImage ? "center" : undefined,
          backgroundRepeat: activePopup.style.backgroundImage ? "no-repeat" : undefined,
        }}
      >
        {scrollbarCss ? <style>{scrollbarCss}</style> : null}
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close popup"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: activePopup.style.closeButtonBackground ?? "transparent",
            color: activePopup.style.closeButtonColor ?? "inherit",
            fontSize: activePopup.style.closeButtonFontSize ?? "22px",
            lineHeight: 1,
            cursor: "pointer",
            padding: activePopup.style.closeButtonPadding ?? "6px 8px",
            borderRadius: activePopup.style.closeButtonBorderRadius ?? undefined,
          }}
        >
          ×
        </button>
        <activePopup.Content />
      </div>
    </div>
  )

  return (
    <PopupRuntimeContext.Provider value={runtimeValue}>
      {children}
      {modal}
    </PopupRuntimeContext.Provider>
  )
}

export function popupSelectField(label: string) {
  return {
    type: "custom" as const,
    label,
    render: ({ value, onChange }: { value: string; onChange: (val: string) => void }) =>
      React.createElement(PopupSelectField, { label, value: value || "", onChange }),
  }
}

function PopupSelectField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (val: string) => void
}) {
  const options = useRegisteredPopups()

  return (
    <div>
      <div style={{ fontSize: "12px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: "32px",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          background: "#fff",
          padding: "0 8px",
          fontSize: "12px",
        }}
      >
        <option value="">— None —</option>
        {options.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name || p.id}
          </option>
        ))}
      </select>
      {options.length === 0 ? (
        <div style={{ marginTop: "6px", fontSize: "11px", color: "#6b7280" }}>
          Add a `PopupDefinition` block on the page to register popups.
        </div>
      ) : null}
    </div>
  )
}

