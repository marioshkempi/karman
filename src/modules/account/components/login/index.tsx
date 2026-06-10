"use client"

import React, { useState } from "react"
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
  const [message, formAction, isPending] = useActionState(login, null)
  const t = useTranslations()

  return (
    <div className="px-0 py-8 lg:px-8">
      <div className="w-full max-w-[480px] mx-auto">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 mb-4">
          <button
            type="button"
            className="text-[24px] leading-[32px] font-extrabold text-[#1A2B3C]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {t("login.loginAction")}
          </button>
          <button
            type="button"
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="text-[24px] leading-[32px] font-normal text-[#94A3B8] hover:text-[#1A2B3C] transition-colors"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {t("register.submit")}
          </button>
        </div>

        {/* Helper text */}
        <p className="text-center text-[15px] text-[#94A3B8] mb-8">
          Αν έχετε λογαριασμό, συνδεθείτε με το όνομα χρήστη ή το email σας.
        </p>

        <form action={formAction} className="flex flex-col gap-5">
          <Input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#1A2B3C] focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 bg-white"
            label="Email ή Κωδικός"
          />

          <Input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#1A2B3C] focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30 bg-white"
            label={t("login.password")}
          />

          <ErrorMessage error={message} />

          {/* Remember me + forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[14px] text-[#1A2B3C] cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-[#007BFF]"
              />
              Να με θυμάσαι
            </label>

            <button
              type="button"
              className="text-[14px] text-[#007BFF] hover:underline"
              onClick={() => setCurrentView(LOGIN_VIEW.FORGOTPASSWORD)}
            >
              {t("login.forgotPassword")}
            </button>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-[42px] bg-[#007BFF] text-white text-[16px] font-semibold rounded-lg hover:bg-[#006ae0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? t("login.submitting") : t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
