import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Fragment, useMemo } from "react"

import Radio from "@modules/common/components/radio"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"

type AddressSelectProps = {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: HttpTypes.StoreCartAddress | null
  onSelect: (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => void
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)
    if (savedAddress) {
      onSelect(savedAddress as HttpTypes.StoreCartAddress)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput))
  }, [addresses, addressInput])

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-secondary text-[16px]">Διεύθυνση αποστολής</label>

      <Listbox onChange={handleSelect} value={selectedAddress?.id}>
        <div className="relative">
          {/* SELECT BUTTON */}
          <Listbox.Button
            className="
              relative
              w-full
              flex
              justify-between
              items-center
              px-4
              py-3
              text-left
              bg-white
              text-primary2
              border
              border-primary2
              rounded-md
              focus:outline-none
              focus:ring-2
              focus:ring-primary2/40
            "
            data-testid="shipping-address-select"
          >
            <>
              <span
                className={clx("block truncate", {
                  "text-secondary font-semibold": !selectedAddress,
                })}
              >
                {selectedAddress
                  ? selectedAddress.address_1
                  : "Επιλέξτε διεύθυνση"}
              </span>

              <ChevronUpDown className="ml-2 shrink-0" />
            </>
          </Listbox.Button>

          {/* OPTIONS */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="
                absolute
                z-20
                w-full
                mt-1
                max-h-60
                overflow-auto
                bg-white
                border
                border-primary2
                rounded-md
                shadow-md
                focus:outline-none
              "
              data-testid="shipping-address-options"
            >
              {addresses.map((address) => (
                <Listbox.Option
                  key={address.id}
                  value={address.id}
                  className="
                    cursor-pointer
                    select-none
                    relative
                    pl-6
                    pr-10
                    py-3
                    hover:bg-primary2/5
                  "
                  data-testid="shipping-address-option"
                >
                  <div className="flex gap-x-4 items-start">
                    <Radio
                      checked={selectedAddress?.id === address.id}
                      data-testid="shipping-address-radio"
                    />

                    <div className="flex flex-col text-primary2">
                      <span className="text-left font-semibold">
                        {address.first_name} {address.last_name}
                      </span>

                      <div className="flex flex-col text-left text-[14px] mt-1">
                        <span>
                          {address.address_1}
                          {address.address_2 && `, ${address.address_2}`}
                        </span>
                        <span>
                          {address.postal_code}, {address.city}
                        </span>
                        <span>
                          {address.province && `${address.province}, `}
                          {address.country_code?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default AddressSelect
