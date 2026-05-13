import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

import LoginTemplate from "@modules/account/templates/login-template"
import Overview from "@modules/account/components/overview"
import { getWishlistCount } from "@lib/data/wishlist"
import { getPageSeo, toNextMetadata } from "@lib/data/seo"
import { JsonLd } from "@lib/util/structured-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("account")

  return toNextMetadata(seo, {
    title: "Account",
    description: "Overview of your account activity.",
  })
}

export default async function AccountPage() {
  const [customer, seo] = await Promise.all([
    retrieveCustomer().catch(() => null),
    getPageSeo("account"),
  ])

  if (!customer) {
    return (
      <>
        {seo?.structured_data && <JsonLd data={seo.structured_data} />}
        <LoginTemplate siteKey={""} />
      </>
    )
  }

  const wishlistCount = (await getWishlistCount().catch(() => 0)) || 0
  const orders = (await listOrders().catch(() => null)) || null

  return (
    <>
      {seo?.structured_data && <JsonLd data={seo.structured_data} />}
      <Overview customer={customer} orders={orders} />
    </>
  )
}
