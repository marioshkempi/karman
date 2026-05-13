"use client"

import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { login } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { useTranslations } from "next-intl"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const LoginForm = ({ setCurrentView }: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [message, formAction, isPending] = useActionState(login, null)
  const t = useTranslations()

  return (
    <div className="px-0 py-5 lg:px-8">
      <div className="max-w-[720px] mx-auto">
        <h1 className="text-primary2 text-[20px] sm:text-[32px] font-semibold text-center mb-6">
          {t("login.title")}
        </h1>

        <div className="border border-primary2 bg-white p-6 sm:p-8">
          <form action={formAction} className="space-y-6">
            <Input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-primary2 text-primary2 focus:outline-none focus:ring-2 focus:ring-primary2/40 bg-white"
              label={t("login.email")}
            />

            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              label={t("login.password")}
            />

            <ErrorMessage error={message} />

            <div className="text-center flex flex-col space-y-3">
              <button
                type="button"
                className="text-primary2 text-[14px] hover:underline"
                onClick={() => setCurrentView(LOGIN_VIEW.FORGOTPASSWORD)}
              >
                {t("login.forgotPassword")}
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-1/2 bg-primary2 text-white text-[18px] font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
              >
                {isPending ? t("login.submitting") : t("login.submit")}
              </button>

              <button
                type="button"
                onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
                className="text-primary2 text-[14px] hover:underline"
              >
                {t("login.noAccount")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
