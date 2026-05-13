"use client"

import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import Breadcrumb from "@modules/common/components/breadcrumb"
import NewsletterSignup from "@modules/home/components/newsletter"
import SocialFollowSection from "@modules/home/components/socials"
import { listSocials } from "@lib/data/socials"

interface AccountLayoutProps {
  customer?: HttpTypes.StoreCustomer| null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
                                                       customer,
                                                       children,
                                                     }) => {
  return (
    <div className="small:py-8" data-testid="account-page">
      <div className="h-full max-w-[1350px] bg-white flex flex-col mx-auto px-4 sm:px-6">
        <div className="ml-[15px] small:ml-0">
          <Breadcrumb
            showEllipsis={true}
            ellipsisPosition={1}
            lastLabel={customer ? "Ο Λογαριασμός μου" : "Σύνδεση"}
          />
        </div>

        <div className="flex flex-col small:flex-row small:gap-x-5">
          {customer && (
            <div className="small:w-64 small:flex-shrink-0">
              <AccountNav customer={customer} />
            </div>
          )}

          <div className="flex-1">{children}</div>
        </div>
      </div>

      {customer && (
        <div className="mt-8">
          <NewsletterSignup />
        </div>
      )}
    </div>
  )
}

export default AccountLayout



//
// interface AccountLayoutProps {
//   customer: HttpTypes.StoreCustomer | null
//   children: React.ReactNode
// }
//
// // const AccountLayout: React.FC<AccountLayoutProps> = async ({
// //   customer,
// //   children,
// // }) => {
// const AccountLayout: React.FC<AccountLayoutProps> = ({
//                                                        customer,
//                                                        children,
//                                                      }) => {
//   // const { socials } = await listSocials()
//   if (!customer) {
//     return (
//       <div className="pt-2" data-testid="account-page">
//         <div className="h-full max-w-[1350px] bg-white flex flex-col  mx-auto px-4 sm:px-6 pt-0">
//           <div className="ml-[15px] small:ml-0">
//             <Breadcrumb
//               showEllipsis={true}
//               ellipsisPosition={1}
//               lastLabel={"Σύνδεση"}
//             />
//           </div>
//           <div>{customer && <AccountNav customer={customer} />}</div>
//           <div className="flex-1">{children}</div>
//         </div>
//       </div>
//     )
//   }
//
//   return (
//     <div className="small:py-8" data-testid="account-page">
//       <div className="h-full max-w-[1350px] bg-white flex flex-col mx-auto px-4 sm:px-6">
//         <div className="ml-[15px] small:ml-0">
//           <Breadcrumb
//             showEllipsis={true}
//             ellipsisPosition={1}
//             lastLabel={"Ο Λογαριασμός μου"}
//           />
//         </div>
//         <div className="flex flex-col small:flex-row small:gap-x-5">
//           <div className="small:w-64 small:flex-shrink-0">
//             {customer && <AccountNav customer={customer} />}
//           </div>
//           <div className="flex-1">{children}</div>
//         </div>
//       </div>
//       <div className="mt-8">
//         <NewsletterSignup />
//         <div className="mt-12">
//           {/*<SocialFollowSection socials={socials} />*/}
//         </div>
//       </div>
//     </div>
//   )
// }
//
// export default AccountLayout
