import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Διευθύνσεις",
  description: "Δείτε τις διευθύνσεις σας",
}

export default async function Addresses(props: { params: Promise<{}> }) {
  const params = await props.params

  const customer = await retrieveCustomer()
  const region = await getRegion()

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="hidden small:block">
        <div className="mb-2">
          <h1 className="text-xl-semi text-secondary font-extrabold">
            Διευθύνσεις
          </h1>
        </div>
      </div>
      <div className="mb-8 flex flex-col gap-y-4">
        <div className="small:hidden">
          <h1 className="text-2xl-semi text-secondary">
            Διευθύνσεις αποστολής
          </h1>
        </div>
        <p className="text-base-regular text-secondary">
          Δείτε και ενημερώστε τις διευθύνσεις αποστολής σας. Μπορείτε να
          προσθέσετε όσες θέλετε. Οι αποθηκευμένες διευθύνσεις θα είναι
          διαθέσιμες κατά την ολοκλήρωση παραγγελίας.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
