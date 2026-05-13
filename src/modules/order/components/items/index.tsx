import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { convertToLocale } from "@lib/util/money"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="flex flex-col">
      <style dangerouslySetInnerHTML={{
        __html: `
          .order-items-table [data-component="table-row"]:hover,
          .order-items-table tr:hover {
            background-color: transparent !important;
          }
        `
      }} />
      <div className="bg-lightyellow px-4 py-2 order-items-table">
        <Table>
          <Table.Body data-testid="products-table">
            {items?.length
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return (
                      <Item
                        key={item.id}
                        item={item}
                        currencyCode={order.currency_code}
                      />
                    )
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        </Table>
        <div className="h-px border-b border-secondary my-4 -mx-4" />
        <div className="flex items-center justify-between pb-2">
          <span className="text-base-regular text-secondary font-semibold">TOTAL</span>
          <span className="text-base-regular text-secondary font-semibold">
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Items
