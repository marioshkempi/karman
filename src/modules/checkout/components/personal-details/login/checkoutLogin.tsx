import React, { useState, useEffect, useRef } from "react"
import { login } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useActionState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Input from "@modules/common/components/input"
import { useTranslations } from "next-intl"

type Props = {
  onForgotPassword?: () => void
  onRegister?: () => void
}

const CheckoutLoginForm = ({ onForgotPassword, onRegister }: Props) => {
  const t = useTranslations()
  const [message, formAction, isPending] = useActionState(login, null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const hasRedirected = useRef(false)
  const wasPending = useRef(false)

  useEffect(() => {
    if (isPending) {
      wasPending.current = true
    } else if (wasPending.current && !message && !hasRedirected.current) {
      const navigateTo = searchParams.get("navigateTo")
      if (navigateTo) {
        hasRedirected.current = true
        const countryCode = pathname.split("/")[1]
        router.push(`/${countryCode}/${navigateTo}`)
      }
    }
  }, [message, isPending, searchParams, router, pathname])

  return (
    <div className="w-full">
      <form action={formAction} className="space-y-4">
        {/* Email Field */}
        <Input
          type="email"
          name="email"
          label="e-mail"
          required
          autoComplete="email"
          placeholder={t("address.enterEmail")}
        />

        <Input
          type="password"
          name="password"
          label={t("checkoutLogin.password")}
          required
          autoComplete="current-password"
          placeholder={t("address.enterPassword")}
        />



        <ErrorMessage error={message} />

        <div className="pt-2">
          <p className="text-[14px] text-black">{t("checkoutLogin.forgotPassword")}</p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 px-6 py-3 bg-[#FF8C00] text-white font-medium hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? t("checkoutLogin.loggingIn") : t("checkoutLogin.login")}
        </button>

        <div className="text-left pt-2">
          <p className="text-[14px] text-black">
            {t("checkoutLogin.noAccount")}{" "}
            <button
              type="button"
              onClick={onRegister}
              className="text-orange hover:underline font-medium"
            >
              {t("register.registerAction")}
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export default CheckoutLoginForm
