import { Metadata } from "next"
import { notFound } from "next/navigation"

import { cookies } from "next/headers"
import PiraeusBankPaymentHandler from "@modules/checkout/components/piraeus-bank/piraeus-bank-payment-handler"
import { retrieveCart } from "@lib/data/cart"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t("checkout.validatePageTitle"),
    description: t("checkout.validatePageDescription"),
  }
}

export default async function PiraeusBankValidatePage() {
  const cookieStore: any = await cookies()
  const cartId = cookieStore.get("_medusa_cart_id").value
  ////(cartId)
  if (!cartId) {
    notFound()
  }

  const cart = await retrieveCart(cartId).then((cart) => cart)

  if (!cart) {
    notFound()
  }
  ////(cart)
  // Verify the payment provider is Piraeus Bank
  const isPiraeusBankSelected = cart.payment_collection?.payment_sessions?.some(
    (session) => session.provider_id === "pp_piraeus-bank_piraeus-bank"
  )
  ////(isPiraeusBankSelected)
  if (!isPiraeusBankSelected) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PiraeusBankPaymentHandler cart={cart} cartId={cartId as any} />
    </div>
  )
}
