import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import PersonalDetails from "@modules/checkout/components/personal-details"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { getSiteSettings } from "@lib/data/site-settings"
import { getPaymentFees } from "@lib/data/payment-fee"
import { getInvoice } from "@lib/data/invoice"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(
    cart.region?.id ?? "",
    cart.id
  )

  const paymentFees = await getPaymentFees(
    cart.total ?? 0,
    cart.currency_code ?? "eur"
  )

  const checkoutSettings = await getSiteSettings([
    "SLMSHIPPING_API_CONFIG",
    "BOXNOW_CARRIER_CONFIG",
    "ACSPOINTS_CARRIER_CONFIG",
    "SLMSHIPPING_CARRIER_CONFIG",
  ])

  if (!shippingMethods || !paymentMethods) {
    return null
  }
  const invoice = await getInvoice(cart.id)
  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <PersonalDetails customer={customer} />

      <Addresses cart={cart} customer={customer} invoice={invoice} />

      <Shipping
        cart={cart}
        availableShippingMethods={shippingMethods}
        checkoutSettings={checkoutSettings}
      />

      <Payment
        cart={cart}
        availablePaymentMethods={paymentMethods}
        paymentFees={paymentFees}
      />

      <Review cart={cart} />
    </div>
  )
}
