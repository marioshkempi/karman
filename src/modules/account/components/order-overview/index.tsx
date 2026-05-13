"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { paymentInfoMap } from "@lib/constants"
import ReorderAction from "@modules/order/components/reorder-action"
import { useTranslations } from "next-intl"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  const t = useTranslations()

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString
    return date.toLocaleDateString("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: t("orderStatus.pending"), color: "bg-amber-100 text-amber-800" },
      completed: {
        label: t("orderStatus.completed"),
        color: "bg-emerald-100 text-emerald-800",
      },
      archived: {
        label: t("orderStatus.archived"),
        color: "bg-gray-100 text-gray-600",
      },
      canceled: { label: t("orderStatus.canceled"), color: "bg-red-100 text-red-700" },
      requires_action: {
        label: t("orderStatus.requiresAction"),
        color: "bg-orange-100 text-orange-800",
      },
    }
    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-600" }
    )
  }

  const formatFulfillmentStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      not_fulfilled: {
        label: t("orderStatus.notFulfilled"),
        color: "bg-amber-100 text-amber-800",
      },
      partially_fulfilled: {
        label: t("orderStatus.partiallyFulfilled"),
        color: "bg-sky-100 text-sky-800",
      },
      fulfilled: {
        label: t("orderStatus.fulfilled"),
        color: "bg-emerald-100 text-emerald-800",
      },
      partially_shipped: {
        label: t("orderStatus.partiallyShipped"),
        color: "bg-sky-100 text-sky-800",
      },
      shipped: {
        label: t("orderStatus.shipped"),
        color: "bg-emerald-100 text-emerald-800",
      },
      partially_returned: {
        label: t("orderStatus.partiallyReturned"),
        color: "bg-violet-100 text-violet-800",
      },
      returned: {
        label: t("orderStatus.returned"),
        color: "bg-violet-100 text-violet-800",
      },
      canceled: { label: t("orderStatus.canceled"), color: "bg-red-100 text-red-700" },
      requires_action: {
        label: t("orderStatus.requiresAction"),
        color: "bg-orange-100 text-orange-800",
      },
    }
    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-600" }
    )
  }

  const formatPaymentMethod = (order: HttpTypes.StoreOrder) => {
    const payment = order.payment_collections?.[0]?.payments?.[0]
    if (!payment) return "-"

    const provider = paymentInfoMap[payment.provider_id]
    if (!provider) return "-"

    const paymentMethodMap: Record<string, string> = {
      "Credit card": t("paymentMethod.creditCard"),
      "Cash on delivery": t("paymentMethod.cashOnDelivery"),
      "Manual Payment": t("paymentMethod.bankTransfer"),
      PayPal: "PayPal",
      iDeal: "iDeal",
      Bancontact: "Bancontact",
    }

    return paymentMethodMap[provider.title] || provider.title
  }

  if (orders?.length) {
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .orders-table-scrollbar::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .orders-table-scrollbar::-webkit-scrollbar-track {
              background: #E5E5CC;
              border-radius: 3px;
            }
            .orders-table-scrollbar::-webkit-scrollbar-thumb {
              background: #8E8E5B;
              border-radius: 3px;
            }
            .orders-table-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #6B6B44;
            }
          `,
          }}
        />

        {/* Mobile card view */}
        <div className="block small:hidden" data-testid="orders-cards">
          <div className="flex flex-col gap-4">
            {orders.map((order: HttpTypes.StoreOrder) => {
              const fulfillment = formatFulfillmentStatus(
                order.fulfillment_status || order.status
              )
              return (
                <div
                  key={order.id}
                  className="bg-lightyellow border border-black/5 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-bold text-[15px]">
                      #{order.display_id || order.id}
                    </span>
                    <span
                      className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${fulfillment.color}`}
                    >
                      {fulfillment.label}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-[13px] text-secondary/80">
                    <div className="flex justify-between">
                      <span>{t("account.date")}</span>
                      <span className="font-medium text-secondary">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("account.payment")}</span>
                      <span className="font-medium text-secondary">
                        {formatPaymentMethod(order)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("cart.total")}</span>
                      <span className="font-bold text-secondary text-[14px]">
                        {convertToLocale({
                          amount: order.total,
                          currency_code: order.currency_code,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-1">
                    <LocalizedClientLink
                      href={`/account/orders/details/${order.id}`}
                      className="flex-1"
                    >
                      <button
                        className="bg-quinary text-white text-[13px] font-medium px-4 py-2.5 rounded-base hover:opacity-90 transition-opacity w-full"
                        data-testid="order-details-button"
                      >
                        {t("common.details")}
                      </button>
                    </LocalizedClientLink>
                    <ReorderAction orderId={order.id} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop table view */}
        <div
          className="hidden small:block bg-lightyellow overflow-auto rounded-lg border border-black/5 max-h-[600px] orders-table-scrollbar"
          data-testid="orders-table"
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-lightyellow border-b-2 border-black/10">
                <th className="text-left py-3.5 px-5 text-secondary font-black text-[13px] uppercase tracking-wide">
                  {t("account.order")}
                </th>
                <th className="text-left py-3.5 px-5 text-secondary font-black text-[13px] uppercase tracking-wide">
                  {t("account.date")}
                </th>
                <th className="text-left py-3.5 px-5 text-secondary font-black text-[13px] uppercase tracking-wide">
                  {t("cart.total")}
                </th>
                <th className="text-left py-3.5 px-5 text-secondary font-black text-[13px] uppercase tracking-wide">
                  {t("account.payment")}
                </th>
                <th className="text-left py-3.5 px-5 text-secondary font-black text-[13px] uppercase tracking-wide">
                  {t("account.status")}
                </th>
                <th className="text-left py-3.5 px-5 text-secondary font-black text-[13px] uppercase tracking-wide">
                  {t("account.invoice")}
                </th>
                <th className="py-3.5 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: HttpTypes.StoreOrder, index: number) => {
                const fulfillment = formatFulfillmentStatus(
                  order.fulfillment_status || order.status
                )
                return (
                  <tr
                    key={order.id}
                    className={`${
                      index % 2 === 0 ? "bg-extraLightYellow" : "bg-lightyellow"
                    } hover:bg-black/[0.02] transition-colors`}
                  >
                    <td className="py-4 px-5 text-secondary text-[14px] font-semibold">
                      #{order.display_id || order.id}
                    </td>
                    <td className="py-4 px-5 text-secondary text-[14px]">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-4 px-5 text-secondary text-[14px] font-semibold">
                      {convertToLocale({
                        amount: order.total,
                        currency_code: order.currency_code,
                      })}
                    </td>
                    <td className="py-4 px-5 text-secondary text-[14px]">
                      {formatPaymentMethod(order)}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block text-[12px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${fulfillment.color}`}
                      >
                        {fulfillment.label}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-secondary text-[14px]">—</td>
                    <td className="py-4 px-5">
                      <div className="flex gap-2 items-center justify-end">
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <button
                            className="bg-quinary text-white text-[13px] font-medium px-4 py-2 rounded-base hover:opacity-90 transition-opacity whitespace-nowrap"
                            data-testid="order-details-button"
                          >
                            {t("common.details")}
                          </button>
                        </LocalizedClientLink>
                        <ReorderAction orderId={order.id} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-y-3 py-16 px-6"
      data-testid="no-orders-container"
    >
      <div className="w-16 h-16 rounded-full bg-lightyellow flex items-center justify-center mb-2">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-secondary/50"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <h2 className="text-[18px] font-extrabold text-secondary">
        {t("account.noOrders")}
      </h2>
      <p className="text-[14px] text-secondary/70 text-center max-w-[280px]">
        {t("account.noOrdersMessage")}
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <button
            className="bg-menubg text-white text-[16px] font-medium px-8 py-3 rounded-base hover:opacity-90 transition-opacity"
            data-testid="continue-shopping-button"
          >
            {t("cart.continueShoppingAction")}
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
