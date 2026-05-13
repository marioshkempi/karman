"use client"

import { Search } from "lucide-react"
import { useTranslations } from "next-intl"

export default function SearchInput() {
  const t = useTranslations()
  return (
    <div className="relative w-full lg:w-96">
      <input
        type="text"
        placeholder={t("common.search")}
        className="w-full px-4 py-2 pr-12 text-[12px] text-[#656565] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
        style={{ borderRadius: '20.61px' }}
      />
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  )
}