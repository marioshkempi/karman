import { retrieveCustomer } from "@lib/data/customer"
import AccountLayout from "@modules/account/templates/account-layout"
import LoginTemplate from "@modules/account/templates/login-template"
import { redirect } from "next/navigation"
import { getSiteSetting } from "@lib/data/site-settings"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AccountSectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)
  const siteKey: any = await getSiteSetting("captcha_site_key")

  if (!customer) {
    return (
      <AccountLayout>
        <LoginTemplate siteKey={siteKey} />
      </AccountLayout>
    )
  }

  return <AccountLayout customer={customer}>{children}</AccountLayout>
}


// import { retrieveCustomer } from "@lib/data/customer"
// import { listOrders } from "@lib/data/orders"
// import LoginTemplate from "@modules/account/templates/login-template"
// import Overview from "@modules/account/components/overview"
// import AccountLayout from "@modules/account/templates/account-layout"
//
// export const dynamic = "force-dynamic"
// export const revalidate = 0
//
// export default async function AccountPage() {
//   const customer = await retrieveCustomer().catch(() => null)
//
//   // 🔹 Not logged in → login page
//   if (!customer) {
//     return (
//       <AccountLayout>
//         <LoginTemplate />
//       </AccountLayout>
//     )
//   }
//
//   const orders = await listOrders().catch(() => null)
//
//   return (
//     <AccountLayout customer={customer}>
//       <Overview customer={customer} orders={orders} />
//     </AccountLayout>
//   )
// }
