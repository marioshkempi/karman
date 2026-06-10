import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Input from "@modules/common/components/input"
import { subscribeToNewsletter } from "@lib/data/newsletter"
import { useTranslations } from "next-intl"

const CheckoutGuestForm = () => {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    newsletter: false,
  })

  const getCookie = (name: string) => {
    if (typeof window === "undefined") return ""
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || ""
    return ""
  }
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
  })

  const isFormValid = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email:
        !formData.email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  useEffect(() => {
    const firstName = getCookie("guest_first_name")
    const lastName = getCookie("guest_last_name")
    const email = getCookie("guest_email")
    const newsletter = getCookie("guest_newsletter") === "true"

    if (firstName || lastName || email) {
      setFormData({ firstName, lastName, email, newsletter })
    }
  }, [])

  const getPathWithoutCountryCode = () => {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length > 1 && parts[0] && parts[0].length === 2) {
      return "/" + parts.slice(1).join("/")
    }
    return pathname
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  }

  const handleContinue = async () => {
    if (!isFormValid()) return

    setCookie("guest_first_name", formData.firstName)
    setCookie("guest_last_name", formData.lastName)
    setCookie("guest_email", formData.email)
    setCookie("guest_newsletter", formData.newsletter.toString())

    if (formData.newsletter) {
      await subscribeToNewsletter({
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
      })
    }

    router.push(getPathWithoutCountryCode() + "?step=address")
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="text"
          name="firstName"
          label={t("address.firstName")}
          value={formData.firstName}
          onChange={handleChange}
          required
          placeholder={t("address.enterFirstName")}
        />
        <Input
          type="text"
          name="lastName"
          label={t("address.lastName")}
          value={formData.lastName}
          onChange={handleChange}
          required
          placeholder={t("address.enterLastName")}
        />
      </div>

      <Input
        type="email"
        name="email"
        label={t("address.email")}
        required
        value={formData.email}
        onChange={handleChange}
        placeholder={t("address.enterEmail")}
      />

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="guest-newsletter"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
          className="w-4 h-4 border border-gray-300 cursor-pointer focus:outline-none flex-shrink-0 accent-orange"
        />
        <label
          htmlFor="guest-newsletter"
          className="!text-[14px] text-black cursor-pointer leading-4"
          style={{ transform: "none" }}
        >
          {t("register.subscribeNewsletter")}
        </label>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={
          !formData.firstName.trim() ||
          !formData.lastName.trim() ||
          !formData.email.trim()
        }
        className="mt-6 px-6 py-3 bg-[#FF8C00] text-white font-medium hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {t("common.continue")}
      </button>
    </div>
  )
}

export default CheckoutGuestForm
