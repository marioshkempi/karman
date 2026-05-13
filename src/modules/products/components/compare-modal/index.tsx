"use client"

import { X, Filter, Trash2 } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@lib/util/price-formatter"
import { useCompareStore } from "global-states/use-compare"
import { useState } from "react"
import ProductCartSection from "../compare-model-cart"
import Modal from "@modules/common/components/modal"

const compareFields = [
  { label: "Προϊόν", key: "title" },
  { label: "Υπότιτλος", key: "subtitle" },
  { label: "Τιμή", key: "price" },
  { label: "Μάρκα", key: "brand" },
  { label: "Συλλογή", key: "collection" },
  { label: "Τύπος", key: "type" },
  { label: "Κατάσταση", key: "status" },
  { label: "Περιγραφή", key: "description" },
  { label: "Υλικό", key: "material" },
  { label: "Βάρος", key: "weight" },
  { label: "Πλάτος", key: "width" },
  { label: "Ύψος", key: "height" },
  { label: "Μήκος", key: "length" },
  { label: "Χώρα Προέλευσης", key: "origin_country" },
  { label: "Κωδικός HS", key: "hs_code" },
  { label: "Κωδικός MID", key: "mid_code" },
]

const getValue = (product: any, key: string) => {
  switch (key) {
    case "price":
      const variant = product.variants?.[0]
      const price = variant?.calculated_price?.calculated_amount
      const currency = variant?.calculated_price?.currency_code ?? "usd"
      return price != null ? formatPrice(price, currency) : "-"
    case "brand":
      return product.brand?.name || "-"
    default:
      return product[key] || "-"
  }
}

export function CompareModal({ onClose }: { onClose?: () => void }) {
  const { products, removeProduct, clearAll } = useCompareStore()
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({})
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set())

  const visibleFields = compareFields.filter((f) => !hiddenFields.has(f.key))

  const toggleDescription = (id: string) =>
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }))

  const toggleField = (key: string) =>
    setHiddenFields((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <Modal isOpen close={() => onClose?.()} size="xxlarge">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-rounded">
        <h2 className="text-[16px] lg:text-[18px] font-bold text-black">
          Σύγκριση Προϊόντων
          {products.length > 0 && (
            <span className="ml-1.5 text-[13px] font-normal text-gray-500">
              ({products.length})
            </span>
          )}
        </h2>
        <div className="flex items-center gap-1.5">
          {products.length > 0 && (
            <>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Πεδία</span>
                  {hiddenFields.size > 0 && (
                    <span className="bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {compareFields.length - hiddenFields.size}
                    </span>
                  )}
                </button>
                {showFilterMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowFilterMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
                      <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-medium text-[12px] text-gray-700">
                          Πεδία
                        </span>
                        <button
                          onClick={() => setHiddenFields(new Set())}
                          className="text-[11px] text-primary hover:underline"
                        >
                          Επαναφορά
                        </button>
                      </div>
                      <div className="p-1">
                        {compareFields.map((field) => (
                          <label
                            key={field.key}
                            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer text-[12px] text-gray-700"
                          >
                            <input
                              type="checkbox"
                              checked={!hiddenFields.has(field.key)}
                              onChange={() => toggleField(field.key)}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            />
                            {field.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Καθαρισμός</span>
              </button>
            </>
          )}
          <button
            onClick={() => onClose?.()}
            className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="w-7 h-7 text-gray-300 mb-3" />
            <p className="text-[15px] font-medium text-gray-700">
              Δεν υπάρχουν προϊόντα για σύγκριση
            </p>
            <p className="text-[13px] text-gray-500">
              Προσθέστε προϊόντα από τη σελίδα καταλόγου.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => removeProduct(product.id)}
                  className="absolute top-1.5 right-1.5 z-10 bg-white/90 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full p-1 shadow-sm transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="relative aspect-square w-full bg-gray-50">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.title || ""}
                      fill
                      className="object-contain p-3"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[12px] text-gray-400">
                        Χωρίς εικόνα
                      </span>
                    </div>
                  )}
                </div>

                {product.brand?.image_url && (
                  <div className="h-8 relative mx-3 mt-2">
                    <Image
                      src={product.brand.image_url}
                      alt={product.brand.name || ""}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                )}

                <div className="px-3 py-2 border-b border-gray-100">
                  <ProductCartSection product={product} />
                </div>

                <div className="px-3 py-2 space-y-2 flex-1 overflow-y-auto">
                  {visibleFields.map((field) => {
                    const value = getValue(product, field.key)
                    if (value === "-") return null

                    return (
                      <div key={field.key}>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                          {field.label}
                        </span>
                        {field.key === "description" ? (
                          <div>
                            <div
                              className={`text-[12px] text-gray-700 leading-snug mt-0.5 prose prose-sm max-w-none prose-p:my-0.5 prose-ul:my-0.5 prose-li:my-0 [&_*]:text-[12px] ${
                                !expandedDescriptions[product.id]
                                  ? "line-clamp-4"
                                  : ""
                              }`}
                              dangerouslySetInnerHTML={{ __html: value }}
                            />
                            {value.length > 150 && (
                              <button
                                onClick={() => toggleDescription(product.id)}
                                className="text-[11px] text-primary hover:underline mt-0.5"
                              >
                                {expandedDescriptions[product.id]
                                  ? "Λιγότερα"
                                  : "Περισσότερα"}
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-[12px] text-gray-700 font-medium mt-0.5">
                            {value}
                          </p>
                        )}
                      </div>
                    )
                  })}

                  {(() => {
                    const filtered = product.options?.filter((opt: any) => {
                      return (
                        opt.title?.toLowerCase() !== "default option" &&
                        !opt.values?.some(
                          (v: any) => v.value?.toLowerCase() === "default"
                        )
                      )
                    })
                    if (!filtered?.length) return null
                    return (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                          Επιλογές
                        </span>
                        {filtered.map((opt: any) => (
                          <p
                            key={opt.id}
                            className="text-[12px] text-gray-700 mt-0.5"
                          >
                            <span className="font-medium">{opt.title}:</span>{" "}
                            {opt.values?.map((v: any) => v.value).join(", ") ||
                              "-"}
                          </p>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
