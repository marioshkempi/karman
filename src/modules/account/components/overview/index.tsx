"use client"

import { Container } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { paymentInfoMap } from "@lib/constants"
import { useTranslations } from "next-intl"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const t = useTranslations()

  const formatFulfillmentStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      not_fulfilled: t("orderStatus.notFulfilled"),
      partially_fulfilled: t("orderStatus.partiallyFulfilled"),
      fulfilled: t("orderStatus.fulfilled"),
      partially_shipped: t("orderStatus.partiallyShipped"),
      shipped: t("orderStatus.shipped"),
      partially_returned: t("orderStatus.partiallyReturned"),
      returned: t("orderStatus.returned"),
      canceled: t("orderStatus.canceled"),
      requires_action: t("orderStatus.requiresAction"),
      delivered: t("orderStatus.delivered"),
    }
    return statusMap[status] || status
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

  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="mb-2 flex flex-col gap-1">
          <span
            className="font-semibold text-xl text-secondary"
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            {t("account.hello", { name: customer?.first_name })}
          </span>
        </div>
        <div className="flex flex-col pt-2 pb-8">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <LocalizedClientLink
                href="/account/profile"
                className="block bg-[#EDEFF5] hover:bg-[#283882] transition-all"
              >
                <div className=" rounded-[4px] p-4 flex flex-col gap-y-1  transition-all cursor-pointer group">
                  <h3 className="text-[14px] text-black group-hover:text-white">
                    {t("account.profile")}
                  </h3>
                  <span
                    className="text-[28px] font-bold leading-none text-black group-hover:text-white"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="text-[14px] text-black group-hover:text-white">
                    {t("account.profileCompletion")}
                  </span>
                </div>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/account/addresses"
                className="block bg-[#EDEFF5] hover:bg-[#283882] transition-all"
              >
                <div className=" rounded-[4px] p-4 flex flex-col gap-y-1  transition-all cursor-pointer group">
                  <h3 className="text-[14px] text-black group-hover:text-white">
                    {t("account.addresses")}
                  </h3>
                  <span
                    className="text-[28px] font-bold leading-none text-black group-hover:text-white"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="text-[14px] text-black group-hover:text-white">
                    {t("account.saved")}
                  </span>
                </div>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/account/orders"
                className="block bg-[#EDEFF5] hover:bg-[#283882] transition-all"
              >
                <div className=" rounded-[4px] p-4 flex flex-col gap-y-1  transition-all cursor-pointer group">
                  <h3 className="text-[14px] text-black group-hover:text-white">
                    {t("account.orders")}
                  </h3>
                  <span className="text-[28px] font-bold leading-none text-black group-hover:text-white">
                    {orders?.length || 0}
                  </span>
                  <span className="text-[14px] text-black group-hover:text-white opacity-0">
                    {t("account.saved")}
                  </span>
                </div>
              </LocalizedClientLink>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-[20px] uppercase font-semibold text-secondary">
                  {t("account.recentOrders")}
                </h3>
              </div>
              {orders && orders.length > 0 ? (
                <>
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                      .orders-table-scrollbar::-webkit-scrollbar {
                        width: 6px;
                        height: 6px;
                      }
                      .orders-table-scrollbar::-webkit-scrollbar-track {
                        background: #FFFFFF;
                      }
                      .orders-table-scrollbar::-webkit-scrollbar-thumb {
                        background: #1F3C88;
                        border-radius: 3px;
                      }
                      .orders-table-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #1A3373;
                      }
                    `,
                    }}
                  />
                  <div
                    className="bg-[#F9F9FB] overflow-auto px-3.5 pb-4 max-h-[600px] orders-table-scrollbar"
                    data-testid="orders-table"
                  >
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left py-3 px-4 text-black font-black text-[14px]">
                            {t("account.orderCode")}
                          </th>
                          <th className="text-left py-3 px-4 text-black font-black text-[14px]">
                            {t("account.date")}
                          </th>
                          <th className="text-left py-3 px-4 text-black font-black text-[14px]">
                            {t("account.totalAmount")}
                          </th>
                          <th className="text-left py-3 px-4 text-black font-black text-[14px]">
                            {t("account.payment")}
                          </th>
                          <th className="text-left py-3 px-4 text-black font-black text-[14px]">
                            {t("account.status")}
                          </th>
                          <th className="text-left py-3 px-4 text-black font-black text-[14px]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .slice(0, 5)
                          .map((order: HttpTypes.StoreOrder, index: number) => (
                            <tr
                              key={order.id}
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "#F9F9FB" : "#EDEFF5",
                              }}
                            >
                              <td className="py-4 px-4 text-black text-[14px]">
                                #{order.display_id || order.id}
                              </td>
                              <td className="py-4 px-4 text-black text-[14px]">
                                {formatDate(order.created_at)}
                              </td>
                              <td className="py-4 px-4 text-black text-[14px]">
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </td>
                              <td className="py-4 px-4 text-black text-[14px]">
                                {formatPaymentMethod(order)}
                              </td>
                              <td className="py-4 px-4 text-black text-[14px]">
                                {formatFulfillmentStatus(
                                  order.fulfillment_status || order.status
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <LocalizedClientLink
                                  href={`/account/orders/details/${order.id}`}
                                >
                                  <button
                                    className="bg-primary text-white text-[12px] px-4 py-2 hover:opacity-90 transition-opacity"
                                    style={{ borderRadius: "155px" }}
                                    data-testid="order-details-button"
                                  >
                                    {t("common.details")}
                                  </button>
                                </LocalizedClientLink>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <span className="text-black" data-testid="no-orders-message">
                  {t("account.noRecentOrders")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const formatDate = (dateString: string | Date) => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString
  return date.toISOString().split("T")[0]
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
