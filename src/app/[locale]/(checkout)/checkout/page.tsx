import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getPageSeo, toNextMetadata } from "@lib/data/seo"
import { JsonLd } from "@lib/util/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("checkout")

  return toNextMetadata(seo, {
    title: "Checkout",
  })
}

export default async function Checkout() {
  const cart = await retrieveCart()
  if (!cart || !cart.items?.length) {
    redirect("/")
  }
  // if (!cart) {
  //   return notFound()
  // }

  const [customer, seo] = await Promise.all([
    retrieveCustomer(),
    getPageSeo("checkout"),
  ])

  return (
    <>
      {seo?.structured_data && <JsonLd data={seo.structured_data} />}
      <div className="flex flex-col small:flex-row content-container gap-x-6 py-8 flex-1">
        <div className="flex-1">
          <PaymentWrapper cart={cart}>
            <CheckoutForm cart={cart} customer={customer} />
          </PaymentWrapper>
        </div>
        <div className="flex-1 flex">
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </>
  )
}
