"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import CheckCircleSolid from "@modules/common/icons/check-circle-solid"
import { Text } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"

import { HttpTypes } from "@medusajs/types"
import CheckoutLoginForm from "@modules/checkout/components/personal-details/login/checkoutLogin"
import CheckoutGuestForm from "@modules/checkout/components/personal-details/guest/checkoutGuest"
import CheckoutStepHeader from "../checkout-steps-heading"
import { signout } from "@lib/data/customer"

type Tab = "guest" | "login"

const PersonalDetails = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<Tab>("guest")
  const [hasGuestData, setHasGuestData] = useState(false)

  const isOpen =
    searchParams.get("step") === "personal" || !searchParams.get("step")

  const getCookie = (name: string) => {
    if (typeof window === "undefined") return ""
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || ""
    return ""
  }

  useEffect(() => {
    // Check if guest has filled the form
    const firstName = getCookie("guest_first_name")
    const lastName = getCookie("guest_last_name")
    const guest_email = getCookie("guest_email")

    setHasGuestData(!!(firstName && lastName && guest_email))
  }, [searchParams])

  const getPathWithoutCountryCode = () => {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length > 1 && parts[0] && parts[0].length === 2) {
      return "/" + parts.slice(1).join("/")
    }
    return pathname
  }

  const handleEdit = () => {
    router.push(getPathWithoutCountryCode() + "?step=personal")
  }

  const handleContinue = () => {
    router.push(getPathWithoutCountryCode() + "?step=address")
  }

  // Show completed state for guests with data or logged-in customers
  const isCompleted: any = customer || (!customer && hasGuestData && !isOpen)

  return (

    <div className="bg-white">
      <CheckoutStepHeader
        title="Προσωπικά στοιχεία"
        isOpen={false}
        isCompleted={isCompleted}
        onEdit={handleEdit}
        editLabel="Επεξεργασία"
        testId="edit-personal-button"
      />

      {isOpen ? (
        <div className="pb-8">
          {!customer && (
            <>
              {/* Tabs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                <button
                  type="button"
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[16px] font-medium rounded-[4px] transition-all ${
                    activeTab === "guest"
                      ? "bg-primary text-white"
                      : "bg-white border border-[#707070] text-black hover:opacity-80"
                  }`}
                  onClick={() => setActiveTab("guest")}
                >
                  Παραγγελία ως επισκέπτης
                </button>
                <button
                  type="button"
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[16px] font-medium rounded-[4px] transition-all ${
                    activeTab === "login"
                      ? "bg-primary text-white"
                      : "bg-white border border-[#707070] text-black hover:opacity-80"
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  Σύνδεση
                </button>
              </div>

              {/* Tab Content */}
              <div className="w-full">
                {activeTab === "guest" ? (
                  <CheckoutGuestForm />
                ) : (
                  <CheckoutLoginForm />
                )}
              </div>
            </>
          )}

          {customer && (
            <div className="space-y-4">
              <p className="text-[14px] sm:text-[16px] text-black">
                Έχετε συνδεθεί ως{" "}
                <span className="font-semibold">{customer.email}</span>
                {" · "}
                <button
                  type="button"
                  onClick={() => signout()}
                  className="text-actionBlue text-[12px] hover:underline"
                >
                  Αποσύνδεση
                </button>
              </p>
              <button
                type="button"
                onClick={handleContinue}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white text-[14px] sm:text-base font-medium hover:opacity-90 transition-opacity rounded-[4px]"
                data-testid="continue-logged-in-button"
              >
                Συνέχεια
              </button>
            </div>
          )}
        </div>
      ) : null}
      <Divider className="mt-8" />
    </div>
  )
}

export default PersonalDetails
