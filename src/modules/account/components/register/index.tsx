"use client"
import React, { useState, useRef, useEffect } from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { signup } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useActionState } from "react"
import CaptchaWidget, { CaptchaWidgetRef } from "@modules/captcha"
import { useCaptchaConfig } from "@modules/captcha/captcha-context"
import Input from "@modules/common/components/input"
import CheckboxWithLabel from "@modules/common/components/checkbox"
import { useTranslations } from "next-intl"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const RegistrationForm = ({ setCurrentView }: Props) => {
  const t = useTranslations()
  const captchaConfig = useCaptchaConfig()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false)

  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [pendingSubmit, setPendingSubmit] = useState(false)

  const captchaRef = useRef<CaptchaWidgetRef>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [message, formAction, isPending] = useActionState(signup, null)

  const captchaRequired =
    captchaConfig?.enabled &&
    captchaConfig.protected_forms?.includes("register")

  const isInvisibleCaptcha =
    captchaConfig?.version !== "v2_checkbox" &&
    captchaConfig?.version !== "turnstile"

  const submitForm = (token: string | null) => {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    if (token) formData.set("captcha_token", token)
    formAction(formData)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // For invisible captcha (v2_invisible, v3), trigger execute and wait
    if (captchaRequired && !captchaToken && isInvisibleCaptcha) {
      setPendingSubmit(true)
      captchaRef.current?.execute()
      return
    }

    submitForm(captchaToken)
  }

  // Auto-submit once invisible captcha resolves
  useEffect(() => {
    if (captchaToken && pendingSubmit) {
      setPendingSubmit(false)
      submitForm(captchaToken)
    }
  }, [captchaToken, pendingSubmit])

  // Reset captcha after server action completes
  useEffect(() => {
    if (!isPending && message) {
      captchaRef.current?.reset()
      setCaptchaToken(null)
    }
  }, [isPending, message])

  const isFormValid =
    agreeToTerms &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    (!captchaRequired || isInvisibleCaptcha || captchaToken !== null)

  return (
    <div className="px-0 py-5 lg:px-8">
      <div className="max-w-[720px] mx-auto">
        <h1 className="text-primary2 text-[20px] sm:text-[32px] font-semibold text-center mb-6">
          {t("register.title")}
        </h1>

        <div className="border border-primary2 bg-white p-6 sm:p-8">
          <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
            <Input
              name="first_name"
              type="text"
              label={t("register.firstName")}
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e: any) => setFirstName(e.target.value)}
            />

            <Input
              name="last_name"
              type="text"
              label={t("register.lastName")}
              required
              autoComplete="family-name"
              value={lastName}
              onChange={(e: any) => setLastName(e.target.value)}
            />

            <Input
              name="email"
              type="email"
              label={t("register.email")}
              required
              autoComplete="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />

            <Input
              name="password"
              type="password"
              label={t("register.password")}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />

            <input type="hidden" name="phone" value="" />

            <div className="flex flex-col gap-3 text-secondary text-[14px] leading-4">
              <CheckboxWithLabel
                name="terms"
                checked={agreeToTerms}
                onChange={setAgreeToTerms}
                required
                label={t("register.agreeToTerms")}
                labelLink={{
                  href: "/3-oroi-xrisis",
                  text: t("register.termsAndConditions"),
                }}
              />

              <CheckboxWithLabel
                name="newsletter"
                checked={subscribeNewsletter}
                onChange={setSubscribeNewsletter}
                label={t("register.subscribeNewsletter")}
              />
            </div>

            {captchaConfig && (
              <div className="flex justify-center">
                <CaptchaWidget
                  ref={captchaRef}
                  config={captchaConfig}
                  formType="register"
                  onVerify={setCaptchaToken}
                />
              </div>
            )}

            <ErrorMessage error={message} />

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isPending || !isFormValid}
                className="w-full sm:w-1/2 bg-primary2 text-white text-[18px] font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? t("register.creating") : t("register.submit")}
              </button>
            </div>

            <div className="text-center flex flex-col items-center">
              <p className="text-secondary text-[14px] mb-2">
                {t("register.hasAccount")}
              </p>
              <button
                type="button"
                onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
                className="text-primary2 text-[14px] hover:underline"
              >
                {t("register.loginOrRecover")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegistrationForm
