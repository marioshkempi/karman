"use client"

import { useState } from "react"

type Props = {
  html: string
  limit?: number
}

export default function ReadMoreHtml({ html, limit = 800 }: Props) {
  const [expanded, setExpanded] = useState(false)

  const textLength = html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, "")
    .length

  const shouldTruncate = textLength > limit

  const truncatedHtml = shouldTruncate ? html.slice(0, limit) : html

  return (
    <div>
      <div
        className=""
        dangerouslySetInnerHTML={{
          __html: expanded || !shouldTruncate ? html : truncatedHtml,
        }}
      />

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-primary font-semibold underline"
        >
          {expanded ? "Λιγότερα" : "Δείτε Περισσότερα"}
        </button>
      )}
    </div>
  )
}
