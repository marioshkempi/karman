"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
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
    <div>
      <div className="pb-6">
        <Heading className="text-[31px] font-normal text-secondary">
          {t("cart.shoppingCart")}
        </Heading>
      </div>
      <div className="border border-gray-300 rounded-lg">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                )
              })
          : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </div>
      <div className="mt-6">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 border border-primary rounded-sm text-primary text-[18px] hover:bg-primary hover:text-white transition-colors w-fit"
        >
          <ChevronLeft size={20} />
          {t("cart.continueShopping")}
        </Link>
      </div>
    </div>
  )
}

export default ItemsTemplate