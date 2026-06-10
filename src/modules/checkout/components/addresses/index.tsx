"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import CheckCircleSolid from "@modules/common/icons/check-circle-solid"
import { HttpTypes } from "@medusajs/types"
import { Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import CheckoutStepHeader from "../checkout-steps-heading"
import InvoiceForm from "@modules/checkout/components/invoice/invoice"
import InvoiceToggle from "@modules/checkout/components/invoice/invoiceToggle"
import { useTranslations } from "next-intl"

const Addresses = ({
  cart,
  customer,
  invoice,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  invoice: any
}) => {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [guestData, setGuestData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const getCookie = (name: string) => {
    if (typeof window === "undefined") return ""
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || ""
    return ""
  }

  useEffect(() => {
    // Load guest data from cookies
    if (!customer) {
      setGuestData({
        firstName: getCookie("guest_first_name"),
        lastName: getCookie("guest_last_name"),
        email: getCookie("guest_email"),
      })
    }
  }, [customer])

  const getPathWithoutCountryCode = () => {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length > 1 && parts[0] && parts[0].length === 2) {
      return "/" + parts.slice(1).join("/")
    }
    return pathname
  }

  const handleEdit = () => {
    router.push(getPathWithoutCountryCode() + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)
  const [wantInvoice, setWantInvoice] = useState(!!invoice?.invoice)
  const isFirstRender = useRef(true)

  // Delete invoice only when user explicitly toggles wantInvoice OFF
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!cart?.id || wantInvoice) return

    const handleDelete = async () => {
      try {
        const res = await fetch(`/api/invoice/${cart.id}`, { method: "DELETE" })
        const data = await res.json()
        if (!res.ok) {
          console.error(
            "Failed to delete invoice:",
            data.message || "Unknown error"
          )
        }
      } catch (err: any) {
        console.error("Error deleting invoice:", err.message || err)
      }
    }

    handleDelete()
  }, [wantInvoice])
  return (
    <div className="bg-white">
      <CheckoutStepHeader
        title={t("checkout.shippingAddress")}
        isOpen={isOpen}
        isCompleted={!!cart?.shipping_address}
        onEdit={handleEdit}
        editLabel={t("common.edit")}
        testId="edit-address-button"
      />
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
              guestData={guestData}
            />

            {!sameAsBilling && (
              <div>
                <h2 className="flex flex-row text-[16px] lg:text-[20px] gap-x-2 items-center text-black font-bold pb-4 sm:pb-6 pt-6 sm:pt-8">
                  {t("checkout.billingAddress")}
                </h2>

                <BillingAddress cart={cart} />
              </div>
            )}
            <InvoiceToggle
              wantInvoice={wantInvoice}
              setWantInvoice={setWantInvoice}
            />

            {wantInvoice && (
              <InvoiceForm cart={cart} existingInvoice={invoice.invoice} />
            )}

            <SubmitButtonForm data-testid="submit-address-button">
              {t("checkout.continueToDelivery")}
            </SubmitButtonForm>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : null}
      <Divider className="mt-8" />
    </div>
  )
}

function SubmitButtonForm({
  children,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()
  const t = useTranslations()

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 px-6 py-3 bg-[#FF8C00] text-white font-medium hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      data-testid={dataTestId}
    >
      {pending ? t("common.loading") : children}
    </button>
  )
}

export default Addresses
