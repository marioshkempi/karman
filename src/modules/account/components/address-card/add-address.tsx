"use client"

import { Plus } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import { useEffect, useState, useActionState } from "react"
import { useFormStatus } from "react-dom"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"
import { useTranslations } from "next-intl"

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const t = useTranslations()
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <button
        onClick={open}
        className="hover:bg-primary text-black hover:text-white  border border-primary rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
        data-testid="add-address-button"
      >
        <Plus />
        {t("account.addNew")}
      </button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <Heading className="mb-2 text-secondary">{t("account.addAddress")}</Heading>
        </Modal.Title>
        <form action={formAction} className={"overflow-auto"}>
          <Modal.Body>
            <div className="flex flex-col gap-y-2 w-full">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label={t("address.firstName")}
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label={t("address.lastName")}
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label={t("address.company")}
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label={t("address.address")}
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label={t("address.address2")}
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label={t("address.postalCodeShort")}
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label={t("address.city")}
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <Input
                label={t("address.provinceAlt")}
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label={t("address.phone")}
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-small-regular py-2"
                data-testid="address-error"
              >
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6">
              <button
                type="reset"
                onClick={close}
                className="h-10 px-4 py-2 border border-gray-300 rounded-base text-secondary hover:bg-gray-50 transition-colors"
                data-testid="cancel-button"
              >
                {t("common.cancel")}
              </button>
              <SaveButton />
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

const SaveButton = () => {
  const t = useTranslations()
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-10 px-4 py-2 bg-menubg text-white rounded-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      data-testid="save-button"
    >
      {pending ? (
        <>
          <Spinner className="animate-spin mr-2" />
          {t("account.saving")}
        </>
      ) : (
        t("common.save")
      )}
    </button>
  )
}

export default AddAddress
