"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@medusajs/ui"

import Item from "@modules/checkout/components/item"
import DiscountCode from "@modules/checkout/components/discount-code"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items

  return (
    <div className="bg-white">
      <div className="overflow-y-auto overflow-x-hidden max-h-[420px] custom-scrollbar">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #999933;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
        <Table>
          <Table.Body data-testid="items-table">
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return (
                      <Table.Row key={item.id}>
                        <Table.Cell className={"!p-1"}>
                          <Item
                            item={item}
                            type="preview"
                            currencyCode={cart.currency_code}
                          />
                        </Table.Cell>
                      </Table.Row>
                    )
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        </Table>
      </div>
      <div className="my-8">
        <DiscountCode cart={cart} paddingX="px-10" />
      </div>
    </div>
  )
}

export default ItemsPreviewTemplate
