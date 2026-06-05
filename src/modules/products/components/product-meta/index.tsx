"use client"

import React, { useState, useMemo } from "react"
import ProductReviews from "@modules/products/components/product-reviews"
import { MyStoreProduct } from "../../../../types/global"
import ReadMoreHtml from "@modules/products/components/product-meta/read-more"

interface ProductMetaProps {
  product: MyStoreProduct
  productTabAttachments?: React.ReactNode
}

type TabKey = "description" | "specifications" | "reviews" | "attachments"

const TAB_LABELS: Record<TabKey, string> = {
  description: "Περιγραφή",
  specifications: "Χαρακτηριστικά",
  reviews: "Κριτικές",
  attachments: "Λήψεις",
}

const DownloadIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const ProductMeta: React.FC<ProductMetaProps> = ({
  product,
  productTabAttachments,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("description")
  const [openAccordion, setOpenAccordion] = useState<TabKey | null>(
    "description"
  )

  const hasAttachments =
    (product.product_attachments?.length ?? 0) > 0 || !!productTabAttachments

  const specifications = useMemo(() => {
    const specs: Record<string, string> = {}
    // @ts-ignore
    product.global_feature_values?.forEach((item: any) => {
      const label = item.feature?.name
      const value = item.value
      if (label && value) {
        specs[label] = value
      }
    })
    return specs
  }, [product])

  const tabs: TabKey[] = useMemo(() => {
    const base: TabKey[] = ["description", "specifications", "reviews"]
    if (hasAttachments) base.push("attachments")
    return base
  }, [hasAttachments])

  const tabWidth = hasAttachments ? "md:w-1/4" : "md:w-1/3"

  const toggleAccordion = (key: TabKey) => {
    setOpenAccordion((prev) => (prev === key ? null : key))
  }

  const renderSpecifications = () => {
    const entries = Object.entries(specifications)
    if (entries.length === 0) {
      return (
        <p className="text-[14px] text-gray-400 py-2">
          Δεν υπάρχουν διαθέσιμα χαρακτηριστικά.
        </p>
      )
    }
    return (
      <div className="space-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <div className="flex-1 border px-3 md:px-4 py-1 bg-tertiary">
              <span className="text-[14px] font-medium">{key}</span>
            </div>
            <div className="flex-1 border px-3 md:px-4 py-1 bg-tertiary">
              <span className="text-[14px]">{value}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderAttachments = (variant: "mobile" | "desktop") => {
    if (!product.product_attachments?.length) return null

    if (variant === "mobile") {
      return (
        <ul className="space-y-3">
          {product.product_attachments.map((attachment) => (
            <li key={attachment.id}>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-md hover:bg-tertiary transition-colors text-secondary hover:text-gray-900 font-medium"
              >
                <DownloadIcon />
                {attachment.name}
              </a>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.product_attachments.map((attachment) => (
          <li key={attachment.id}>
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border rounded-lg transition-colors text-secondary hover:text-gray-900 font-semibold"
            >
              <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                <DownloadIcon size={24} />
              </div>
              <div className="flex flex-col">
                <span>{attachment.name}</span>
                <span className="text-[12px] text-gray-400 font-normal">
                  Προβολή
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  const renderTabContent = (tab: TabKey, variant: "mobile" | "desktop") => {
    switch (tab) {
      case "description":
        return (
          <div className="text-secondary text-[14px]">
            <ReadMoreHtml html={product.description || ""} />
          </div>
        )
      case "specifications":
        return renderSpecifications()
      case "reviews":
        return <ProductReviews productId={product.id} />
      case "attachments":
        return (
          <div className="space-y-6">
            {productTabAttachments}
            {renderAttachments(variant)}
          </div>
        )
    }
  }

  return (
    <div className="mt-6">
      {/* Mobile: Accordion */}
      <div className="md:hidden space-y-3">
        {tabs.map((tab) => (
          <div key={tab} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleAccordion(tab)}
              className={`w-full flex justify-between items-center px-4 py-3 text-[16px] font-medium transition-all duration-200 ${
                openAccordion === tab
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white text-[#1e3a5f]"
              }`}
            >
              {TAB_LABELS[tab]}
              <span className="text-lg">{openAccordion === tab ? "−" : "+"}</span>
            </button>
            {openAccordion === tab && (
              <div className="px-4 pb-4 pt-4 text-secondary text-[14px] bg-white">
                {renderTabContent(tab, "mobile")}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: Tabs */}
      <div className="hidden md:block">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 py-3 px-6 text-[16px] font-medium transition-colors ${tabWidth} ${
                activeTab === tab
                  ? "text-[#1e3a5f] border-b-2 border-[#007BFF]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <div className="mt-4 leading-relaxed">
          {renderTabContent(activeTab, "desktop")}
        </div>
      </div>
    </div>
  )
}

export default ProductMeta
