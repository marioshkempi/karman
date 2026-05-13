import { Container, Heading, Text } from "@medusajs/ui"

import { isStripe, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { getTranslations } from "next-intl/server"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = async ({ order }: PaymentDetailsProps) => {
  const t = await getTranslations()
  const payment = order.payment_collections?.[0].payments?.[0]

  const paymentMethodMap: Record<string, string> = {
    "Credit card": t("paymentMethod.creditCard"),
    "Cash on delivery": t("paymentMethod.cashOnDelivery"),
    "Manual Payment": t("paymentMethod.bankTransfer"),
    PayPal: "PayPal",
    iDeal: "iDeal",
    Bancontact: "Bancontact",
  }

  const resolveTitle = (providerId: string) => {
    const info = paymentInfoMap[providerId]
    if (!info) return providerId
    return paymentMethodMap[info.title] || info.title
  }

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        {t("checkout.payment")}
      </Heading>
      <div>
        {payment && (
          <div className="flex items-start gap-x-1 w-full">
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t("checkout.paymentMethod")}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method"
              >
                {resolveTitle(payment.provider_id)}
              </Text>
            </div>
            <div className="flex flex-col w-2/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t("paymentMethod.paymentDetails")}
              </Text>
              <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                  {paymentInfoMap[payment.provider_id]?.icon}
                </Container>
                <Text data-testid="payment-amount">
                  {isStripe(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} ${t("paymentMethod.paidAt")} ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString()}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
