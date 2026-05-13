"use client"

import React from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useActionState } from "react"
import { forgotPassword } from "@lib/data/customer"
import { useTranslations } from "next-intl"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ForgotPasswordForm = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(forgotPassword, null)
  const t = useTranslations()

  return (
    <div className="px-0 py-5 lg:px-8">
      <div className="max-w-[720px] mx-auto">
        <h1 className="text-primary2 text-[20px] sm:text-[32px] font-semibold text-center mb-6">
          {t("forgotPassword.title")}
        </h1>

        <div className="border border-primary2 bg-white p-6 sm:p-8  md:w-[70%] justify-self-center">
          <form action={formAction} className="space-y-6">
            <p className="text-secondary text-[14px] text-center">
              {t("forgotPassword.description")}
            </p>

            <div className="flex flex-col gap-2 items-center justify-center">
              <div className={"flex flex-col gap-2 w-full"}>
                <label className="text-secondary text-[16px] text-left">{t("forgotPassword.email")}</label>

                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="px-4 py-3 border border-primary2 text-primary2 focus:outline-none focus:ring-2 focus:ring-primary2/40 bg-white"
                />
              </div>

            </div>

            <ErrorMessage error={message} />

            <div className="text-center flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary2 text-white text-[18px] font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
              >
                {isPending ? t("forgotPassword.submitting") : t("forgotPassword.submit")}
              </button>

              <button
                type="button"
                onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
                className="text-primary2 text-[14px] hover:underline"
              >
                {t("forgotPassword.backToLogin")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
