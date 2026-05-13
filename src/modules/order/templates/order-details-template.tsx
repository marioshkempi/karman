"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
// import Help from "@modules/order/components/help"
import HelpForm from "@modules/order/components/help-form"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"
import OrderMessages from "@modules/order/components/order-messages"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
  orderMessages: any
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
  orderMessages,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="hidden small:block">
        <div className="mb-2 flex justify-between items-center">
          <h1 className="text-xl-semi text-secondary font-extrabold">
            Order details
          </h1>
          <LocalizedClientLink
            href="/account/orders"
            className="flex gap-2 items-center text-secondary hover:text-secondary/80"
            data-testid="back-to-overview-button"
          >
            <XMark /> Back to overview
          </LocalizedClientLink>
        </div>
      </div>
      <div className="flex gap-2 justify-between items-center small:hidden">
        <h1 className="text-2xl-semi text-secondary">Order details</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-secondary hover:text-secondary/80"
          data-testid="back-to-overview-button"
        >
          <XMark /> Back to overview
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-4 h-full bg-white w-full"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <OrderMessages messages={orderMessages?.messages.data ?? []} />

        <HelpForm orderId={order.id} />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
