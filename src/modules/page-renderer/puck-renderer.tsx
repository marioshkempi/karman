"use client"

import { Render } from "@puckeditor/core"
import { puckConfig } from "./config"
import type { Data } from "@puckeditor/core"
import { PopupProvider } from "./PopupSystem"

export interface Page {
  type: "richtext" | "builder"
  content: string | null
  [key: string]: any
}

function normalizeHexColor(value: unknown): unknown {
  if (typeof value !== "string") return value
  const v = value.trim()
  if (!v) return value

  // already-valid CSS-ish values (keep as-is)
  if (
    v.startsWith("#") ||
    v.startsWith("rgb(") ||
    v.startsWith("rgba(") ||
    v.startsWith("hsl(") ||
    v.startsWith("hsla(") ||
    v.startsWith("var(") ||
    v === "transparent" ||
    v === "inherit" ||
    v === "currentColor"
  ) {
    return v
  }

  // backend may send hex without '#', e.g. "0F0E11" or "0F0E11CC"
  if (/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(v)) return `#${v}`

  return value
}

function normalizePuckColorsDeep(input: unknown): void {
  if (!input || typeof input !== "object") return

  if (Array.isArray(input)) {
    for (const item of input) normalizePuckColorsDeep(item)
    return
  }

  const obj = input as Record<string, any>
  for (const key of Object.keys(obj)) {
    const val = obj[key]

    if (key.endsWith("Color")) {
      obj[key] = normalizeHexColor(val)
      continue
    }

    // Recurse through nested structures (props, content arrays, etc.)
    if (val && typeof val === "object") normalizePuckColorsDeep(val)
  }
}

interface PuckPageRendererProps {
  page: Page
  className?: string
}

export const PuckPageRenderer = ({
  page,
  className,
}: PuckPageRendererProps) => {
  if (!page?.content) return null

  if ( page.content.startsWith("{")) {
    let data: Data

    try {
      data = JSON.parse(page.content)
      normalizePuckColorsDeep(data)
    } catch {
      console.error("[PuckPageRenderer] Failed to parse builder content")
      return null
    }

    return (
      <div
        className={[className, "overflow-x-hidden"].filter(Boolean).join(" ")}
        style={{ overflowX: "hidden" }}
      >
        <PopupProvider>
          <Render config={puckConfig} data={data} />
        </PopupProvider>
      </div>
    )
  }

  // // Rich text fallback
  // return (
  //   <div
  //     className={className ?? "prose prose-lg max-w-none"}
  //     dangerouslySetInnerHTML={{ __html: page.content }}
  //   />
  // )
}
