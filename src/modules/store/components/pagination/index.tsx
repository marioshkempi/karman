"use client"

import { clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({
                             page,
                             totalPages,
                             placement = "right",
                             'data-testid': dataTestid
                           }: {
  page: number
  totalPages: number
  placement?: "left" | "right"
  'data-testid'?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const renderPageButton = (p: number) => (
    <button
      key={p}
      className={clx(
        "w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors",
        p === page
          ? "bg-primary text-white"
          : "text-gray-700"
      )}
      onClick={() => handlePageChange(p)}
    >
      {p}
    </button>
  )

  const renderArrow = (direction: 'left' | 'right', disabled: boolean) => (
    <button
      className={clx(
        "w-10 h-10 flex items-center justify-center text-gray-700",
        disabled && "opacity-30 cursor-not-allowed"
      )}
      onClick={() => !disabled && handlePageChange(direction === 'left' ? page - 1 : page + 1)}
      disabled={disabled}
    >
      {direction === 'left' ? <ChevronLeft size={16} className={"hover:bg-primary hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-full"} /> : <ChevronRight size={16} className={"hover:bg-primary hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-full"}/>}
    </button>
  )

  // Generate the page numbers according to your rules
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const firstPages = [1, 2, 3].filter(p => p <= totalPages)
    const lastPages = [totalPages - 2, totalPages - 1, totalPages].filter(p => p > 0)

    const prevPages = []
    for (let i = page - 3; i <= page; i++) {
      if (i > 3 && i < totalPages - 2) prevPages.push(i)
    }

    const added: Set<number> = new Set()

    // Add first pages
    for (const p of firstPages) {
      pages.push(p)
      added.add(p)
    }

    // Add dots if there’s a gap
    if (prevPages.length && prevPages[0] - Math.max(...firstPages) > 1) {
      pages.push("…")
    }

    // Add middle pages
    for (const p of prevPages) {
      if (!added.has(p)) {
        pages.push(p)
        added.add(p)
      }
    }

    // Add dots if there’s a gap before last pages
    if (lastPages.length && Math.min(...lastPages) - Math.max(...added) > 1) {
      pages.push("…")
    }

    // Add last pages
    for (const p of lastPages) {
      if (!added.has(p)) {
        pages.push(p)
        added.add(p)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={clx(
      "flex w-full mt-12",
      placement === "left" ? "justify-start" : "justify-end"
    )}>
      <div className="flex gap-2 items-center" data-testid={dataTestid}>
        {renderArrow('left', page === 1)}
        {pageNumbers.map((p, i) =>
          typeof p === "string" ? (
            <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-500">…</span>
          ) : (
            renderPageButton(p)
          )
        )}
        {renderArrow('right', page === totalPages)}
      </div>
    </div>
  )
}
