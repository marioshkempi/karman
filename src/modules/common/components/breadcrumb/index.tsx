"use client"

import React, { useMemo } from "react"
import { usePathname } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/* ======================================================
  Types
====================================================== */

type BreadcrumbItem = {
  label: string
  href: string
  isCurrentPage?: boolean
}

type BreadcrumbNode = {
  label: string
  href: string
}

type BreadcrumbProps = {
  className?: string
  showEllipsis?: boolean
  ellipsisPosition?: number
  homeLabel?: string
  lastLabel?: string

  /** Backward compatible (Medusa categories) */
  categories?: HttpTypes.StoreProductCategory[] | null

  /** Generic tree (pages, CMS, account, blog, etc.) */
  tree?: BreadcrumbNode[] | null
}

/* ======================================================
  Component
====================================================== */

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  className = "",
  showEllipsis = false,
  ellipsisPosition = 1,
  homeLabel = "Αρχική",
  lastLabel,
  categories,
  tree,
}) => {
  const pathname = usePathname()

  /* ======================================================
    Build breadcrumb items
  ====================================================== */
  const items = useMemo<BreadcrumbItem[]>(() => {
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: homeLabel, href: "/", isCurrentPage: false },
    ]

    // 1️⃣ Generic tree has priority
    if (tree && tree.length > 0) {
      tree.forEach((node) => {
        breadcrumbItems.push({
          label: node.label,
          href: node.href,
          isCurrentPage: false,
        })
      })
    }

    // 2️⃣ Fallback to categories (existing behavior)
    else if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        breadcrumbItems.push({
          label: cat.name,
          href: `/${cat.handle}`,
          isCurrentPage: false,
        })
      })
    }

    // 3️⃣ Handle last/current page
    if (lastLabel) {
      breadcrumbItems.push({
        label: lastLabel,
        href: pathname || "#",
        isCurrentPage: true,
      })
    } else if (breadcrumbItems.length > 1) {
      breadcrumbItems[breadcrumbItems.length - 1].isCurrentPage = true
    }

    return breadcrumbItems
  }, [tree, categories, lastLabel, pathname, homeLabel])

  /* ======================================================
    Render breadcrumb items with ellipsis
  ====================================================== */
  const renderBreadcrumbItems = useMemo(() => {
    const result: React.ReactNode[] = []
    const minItemsForEllipsis = 4

    items.forEach((item, index) => {
      const showEllipsisHere =
        showEllipsis &&
        items.length >= minItemsForEllipsis &&
        index === ellipsisPosition

      if (showEllipsisHere) {
        result.push(
          <React.Fragment key={`ellipsis-${index}`}>
            <li className="inline-flex items-center">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </li>
            <li className="inline-flex items-center">
              <span className="mx-2 text-primary">/</span>
            </li>
          </React.Fragment>
        )
        return
      }

      result.push(
        <React.Fragment key={`${item.href}-${index}`}>
          <li className="inline-flex items-center">
            {item.isCurrentPage ? (
              <span className="font-medium text-primary whitespace-nowrap">
                {item.label}
              </span>
            ) : (
              <LocalizedClientLink
                href={item.href}
                className="text-primary hover:opacity-80 whitespace-nowrap"
              >
                {item.label}
              </LocalizedClientLink>
            )}
          </li>

          {index < items.length - 1 && (
            <li className="inline-flex items-center">
              <span className="mx-2 text-primary">/</span>
            </li>
          )}
        </React.Fragment>
      )
    })

    return result
  }, [items, showEllipsis, ellipsisPosition])

  if (items.length === 0) return null

  /* ======================================================
    Render
  ====================================================== */
  return (
    <div className="sm:block">
      <nav
        aria-label="Breadcrumb"
        className={`mb-4 sm:mb-6 text-[12px] sm:text-[14px] ${className}`}
      >
        {/* Scroll wrapper */}
        <div className="overflow-x-auto scrollbar-none -mx-3 px-3 md:ps-5">
          <ol className="inline-flex items-center whitespace-nowrap">
            {renderBreadcrumbItems}
          </ol>
        </div>
      </nav>

      {/* Invisible scrollbar styling */}
      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          height: 1px;
        }

        .scrollbar-none::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 9999px;
        }

        .scrollbar-none::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-none {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }
      `}</style>
    </div>
  )
}

export default Breadcrumb
