"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { ChevronLeft } from 'lucide-react'
import Link from "next/link"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { useTranslations } from "next-intl"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const t = useTranslations()

  return (
    <div className="bg-white rounded-[20px] border border-black/10 overflow-hidden px-6 py-5">
      {items
        ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item, index) => {
              return (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code}
                  isFirst={index === 0}
                />
              )
            })
        : repeat(5).map((i) => {
            return <SkeletonLineItem key={i} />
          })}
    </div>
  )
}

export default ItemsTemplate
