// import { Metadata } from "next"
// import PiraeusBankFailureHandler from "@modules/checkout/components/piraeus-bank-failure-handler"
//
// export const metadata: Metadata = {
//   title: "Αποτυχία Πληρωμής | Piraeus Bank",
//   description: "Η πληρωμή σας απέτυχε",
// }
//
// export default async function PiraeusBankFailurePage({
//                                                        searchParams,
//                                                      }: {
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
//   const resultDescription = searchParams.ResultDescription as string | undefined
//   const merchantReference = searchParams.MerchantReference as string | undefined
//
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <PiraeusBankFailureHandler
//         resultDescription={resultDescription}
//         merchantReference={merchantReference}
//       />
//     </div>
//   )
// }