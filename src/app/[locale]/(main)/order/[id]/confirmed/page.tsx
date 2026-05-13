import { retrieveOrder } from "@lib/data/orders"

import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { OrderTrackingClient } from "@modules/tracking/order-tracking-client"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTrackingSettings } from "@lib/data/tracking-scripts"
import { getSiteSetting } from "@lib/data/site-settings"

type Props = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id, false).catch(() => null)

  if (!order) {
    return notFound()
  }

  const tracking = await getTrackingSettings()
  const skroutzConfig = await getSiteSetting("skroutz_config").catch(() => null)

  return (
    <>
      <OrderTrackingClient
        order={{
          id: order.id,
          total: order.total,
          subtotal: order.subtotal,
          shipping_total: order.shipping_total,
          tax_total: order.tax_total,
          currency_code: order.currency_code,
          // @ts-ignore
          discount_code: order.discounts?.[0]?.code,
          // @ts-ignore
          items: order.items.map((item) => ({
            id: item.id,
            variant_id: item.variant_id,
            title: item.title,
            unit_price: item.unit_price,
            quantity: item.quantity,
            metadata: item.metadata,
          })),
        }}
        trackingSettings={tracking}
        skroutzConfig={skroutzConfig as any}
      />
      <OrderCompletedTemplate order={order} />
    </>
  )
}
