"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function FooterAccordionItem({
  title,
  titleUrl,
  children,
}: {
  title: string
  titleUrl?: string | null
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isTitleClickable = titleUrl && titleUrl.trim() !== ""

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-2 cursor-pointer"
        aria-label={isOpen ? "Close section" : "Open section"}
      >
        {isTitleClickable ? (
          <LocalizedClientLink
            href={titleUrl!}
            onClick={(e: any) => e.stopPropagation()}
            className="text-[16px] font-semibold font-noto-sans text-white hover:font-bold transition-colors duration-200 flex-1 text-left"
          >
            {title}
          </LocalizedClientLink>
        ) : (
          <span className="text-[16px] font-semibold font-noto-sans text-white flex-1 text-left">
            {title}
          </span>
        )}
        <svg
          className={`w-5 h-5 transition-transform duration-300 text-white ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  )
}
