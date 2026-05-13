"use client"

import { useEffect } from "react"

type BodyClassManagerProps = {
  pageType: "category" | "product" | "cms-page"
  categoryId?: string
  productId?: string
  pageId?: string
}

export default function BodyClassManager({
  pageType,
  categoryId,
  productId,
  pageId,
}: BodyClassManagerProps) {
  useEffect(() => {
    document.body.id = pageType

    if (categoryId) {
      document.body.classList.add(`category-${categoryId}`)
    }
    if (productId) {
      document.body.classList.add(`product-${productId}`)
    }
    if (pageId) {
      document.body.classList.add(`cms-${pageId}`)
    }

    return () => {
      document.body.removeAttribute("id")
      if (categoryId) document.body.classList.remove(`category-${categoryId}`)
      if (productId) document.body.classList.remove(`product-${productId}`)
      if (pageId) document.body.classList.remove(`cms-${pageId}`)
    }
  }, [pageType, categoryId, productId, pageId])

  return null
}
