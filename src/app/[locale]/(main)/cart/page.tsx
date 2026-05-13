import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBannersByHook } from "@lib/data/banner"
import { getPageSeo, toNextMetadata } from "@lib/data/seo"
import { JsonLd } from "@lib/util/structured-data"

// export const dynamic = "force-dynamic" // ✅ REQUIRED

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("cart")

  return toNextMetadata(seo, {
    title: "Cart",
    description: "View your cart",
  })
}

export default async function Cart() {
  const [cart, customer, { banners }, seo] = await Promise.all([
    retrieveCart().catch((error) => {
      console.error(error)
      return notFound()
    }),
    retrieveCustomer(),
    getBannersByHook("cart-promotional"),
    getPageSeo("cart"),
  ])

  return (
    <>
      {seo?.structured_data && <JsonLd data={seo.structured_data} />}
      <CartTemplate cart={cart} customer={customer} banners={banners} />
    </>
  )
}
