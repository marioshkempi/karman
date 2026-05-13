import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import AccountLayout from "@modules/account/templates/account-layout"
import OrderOverview from "@modules/account/components/order-overview"
import { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const metadata: Metadata = {
  title: "Ιστορικό παραγγελιών",
  description: "Overview of your previous orders.",
}
export default async function OrdersPage() {
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) notFound()

  const orders = await listOrders()

  return <OrderOverview orders={orders} />
}

// import { Metadata } from "next"
//
// import OrderOverview from "@modules/account/components/order-overview"
// import { notFound } from "next/navigation"
// import { listOrders } from "@lib/data/orders"
// import Divider from "@modules/common/components/divider"
// import TransferRequestForm from "@modules/account/components/transfer-request-form"
// import NewsletterSignup from "@modules/home/components/newsletter"
// import SocialFollowSection from "@modules/home/components/socials"
// import { listSocials } from "@lib/data/socials"
//
// export const metadata: Metadata = {
//   title: "Ιστορικό παραγγελιών",
//   description: "Overview of your previous orders.",
// }
//
// export default async function OrdersPage() {
//   const orders = await listOrders()
//   // const { socials } = await listSocials()
//
//   // //console.log("Orders data (server):", orders)
//
//   if (!orders) {
//     notFound()
//   }
//
//   return (
//       <>
//         <div className="w-full" data-testid="orders-page-wrapper">
//           <div className="hidden small:block">
//             <div className="mb-2">
//               <h1 className="text-xl-semi text-secondary font-extrabold">Ιστορικό παραγγελιών</h1>
//             </div>
//           </div>
//           <div className="mb-8 flex flex-col gap-y-4">
//             <div className="small:hidden">
//               <h1 className="text-2xl-semi text-secondary">Ιστορικό παραγγελιών</h1>
//             </div>
//             <p className="text-base-regular text-secondary">
//               View your previous orders and their status. You can also create
//               returns or exchanges for your orders if needed.
//             </p>
//           </div>
//           <div>
//             <OrderOverview orders={orders} />
//             {/* <TransferRequestForm /> */}
//           </div>
//         </div>
//       </>
//     )
// }