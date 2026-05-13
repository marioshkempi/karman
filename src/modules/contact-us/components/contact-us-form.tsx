"use client"
import React, { useState, useRef, useEffect } from "react"
import CaptchaWidget, { CaptchaWidgetRef } from "@modules/captcha"

import Breadcrumb from "@modules/common/components/breadcrumb"
import Alert from "@modules/common/components/alerts/alert"
import { addContactFormEntry } from "@lib/data/contact-form"
import Input from "@modules/common/components/input"
import CheckboxWithLabel from "@modules/common/components/checkbox"
import NativeSelect from "@modules/common/components/native-select"
import { useCaptchaConfig } from "@modules/captcha/captcha-context"
import { useTranslations } from "next-intl"

interface ContactFormProps {
  customer?: any
}

const ContactForm = ({ customer }: ContactFormProps) => {
  const t = useTranslations()
  const captchaConfig = useCaptchaConfig()
  const [subject, setSubject] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const captchaRef = useRef<CaptchaWidgetRef>(null)

  const captchaRequired =
    captchaConfig?.enabled && captchaConfig.protected_forms?.includes("contact")

  useEffect(() => {
    if (customer?.email) setEmail(customer.email)
  }, [customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!agreed) {
      setError(t("contact.agreeRequired"))
      setLoading(false)
      return
    }

    // For invisible captcha (v2_invisible, v3), trigger execute and wait
    if (
      captchaRequired &&
      !captchaToken &&
      captchaConfig?.version !== "v2_checkbox"
    ) {
      captchaRef.current?.execute()
      setLoading(false)
      return
    }

    if (captchaRequired && !captchaToken) {
      setError(t("contact.captchaRequired"))
      setLoading(false)
      return
    }

    try {
      const response: any = await addContactFormEntry({
        email,
        subject,
        message,
        captchaToken: captchaToken || "",
      })

      setSuccess(response.message)
      setSubject("")
      setEmail("")
      setMessage("")
      setCaptchaToken(null)
      captchaRef.current?.reset()
    } catch (err: any) {
      setError(err.message || t("contact.errorSending"))
    } finally {
      setLoading(false)
    }
  }

  // For invisible captcha: submit after token is received
  useEffect(() => {
    if (
      captchaToken &&
      !loading &&
      captchaRequired &&
      captchaConfig?.version !== "v2_checkbox" &&
      captchaConfig?.version !== "turnstile"
    ) {
      // Re-trigger submit
      const form = document.querySelector("form")
      form?.requestSubmit()
    }
  }, [captchaToken])

  return (
    <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
      <Breadcrumb showEllipsis ellipsisPosition={1} lastLabel={t("navigation.contact")} />

      <div className="mt-8 max-w-[900px] mx-auto">
        <h1 className="text-primary text-[35px] font-normal mb-8">
          {t("contact.pageTitle")}
        </h1>

        {success && <Alert type="success" message={success} />}
        {error && <Alert type="danger" message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-secondary text-[20px]">
              {t("contact.subject")} <span className="text-red-500">*</span>
            </label>
            <NativeSelect
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder={t("contact.selectSubject")}
            >
              <option value="general">{t("contact.generalQuestion")}</option>
              <option value="support">{t("contact.support")}</option>
              <option value="feedback">{t("contact.feedback")}</option>
            </NativeSelect>
          </div>

          <Input
            name="email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <div className="flex flex-col gap-2">
            <label className="text-secondary text-[20px]">
              {t("helpForm.messageLabel")} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              required
              className="w-full px-4 py-3 border border-primary r focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <CheckboxWithLabel
              checked={agreed}
              onChange={setAgreed}
              required
              label={t("register.agreeToTerms")}
              labelLink={{
                href: "/3-oroi-xrisis",
                text: t("register.termsAndConditions"),
              }}
            />
          </div>

          {captchaConfig && (
            <div className="mt-4 flex justify-start">
              <CaptchaWidget
                ref={captchaRef}
                config={captchaConfig}
                formType="contact"
                onVerify={setCaptchaToken}
              />
            </div>
          )}

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={
                loading ||
                !agreed ||
                !email.trim() ||
                (captchaRequired &&
                  captchaConfig?.version === "v2_checkbox" &&
                  !captchaToken) ||
                (captchaRequired &&
                  captchaConfig?.version === "turnstile" &&
                  !captchaToken)
              }
              className="bg-primary text-white rounded-[8.49px] hover:opacity-90 transition-opacity disabled:opacity-70 w-[198px] h-[60px]"
            >
              {loading ? t("contact.sending") : t("contact.send")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm

// "use client"
// import React, { useState, useRef, useEffect } from "react"
// import ReCAPTCHA from "react-google-recaptcha"
// import Breadcrumb from "@modules/common/components/breadcrumb"
// import Alert from "@modules/common/components/alerts/alert"
// import { addContactFormEntry } from "@lib/data/contact-form"
// import LocalizedClientLink from "@modules/common/components/localized-client-link"
// import Input from "@modules/common/components/input"
// import CheckboxWithLabel from "@modules/common/components/checkbox"
// import NativeSelect from "@modules/common/components/native-select"
//
// const SITE_KEY: string = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
//
// interface ContactFormProps {
//   siteKey?: string
//   customer?: any
// }
//
// const ContactForm = ({ siteKey = SITE_KEY, customer }: ContactFormProps) => {
//   const [subject, setSubject] = useState("")
//   const [email, setEmail] = useState("")
//   const [message, setMessage] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const recaptchaRef = useRef<ReCAPTCHA>(null)
//   const [captchaToken, setCaptchaToken] = useState<string | null>(null)
//   const [agreed, setAgreed] = useState(false)
//
//   useEffect(() => {
//     if (customer?.email) setEmail(customer.email)
//   }, [customer])
//
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setSuccess(null)
//     setLoading(true)
//
//     if (!agreed) {
//       setError(t("contact.agreeRequired"))
//       setLoading(false)
//       return
//     }
//
//     try {
//       if (!captchaToken) {
//         setError(t("contact.captchaRequired"))
//         return
//       }
//
//       const response: any = await addContactFormEntry({
//         email,
//         subject,
//         message,
//         captchaToken,
//       })
//
//       setSuccess(response.message)
//       setSubject("")
//       setEmail("")
//       setMessage("")
//       setCaptchaToken(null)
//       recaptchaRef.current?.reset()
//     } catch (err: any) {
//       setError(err.message || t("contact.errorSending"))
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   return (
//     <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">
//       <Breadcrumb showEllipsis ellipsisPosition={1} lastLabel={t("navigation.contact")} />
//
//       <div className="mt-8 max-w-[900px] mx-auto">
//         <h1 className="text-primary text-[35px] font-normal mb-8">
//           {t("contact.pageTitle")}
//         </h1>
//
//         {success && <Alert type="success" message={success} />}
//         {error && <Alert type="danger" message={error} />}
//
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex flex-col gap-2">
//             <label className="text-secondary text-[20px]">
//               Θέμα <span className="text-red-500">*</span>
//             </label>
//
//             <NativeSelect
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               required
//               placeholder="Επιλέξτε θέμα"
//             >
//               <option value="general">Γενική Ερώτηση</option>
//               <option value="support">Υποστήριξη</option>
//               <option value="feedback">Ανατροφοδότηση</option>
//             </NativeSelect>
//           </div>
//
//           <Input
//             name="email"
//             label="Email"
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             autoComplete="email"
//           />
//
//           <div className="flex flex-col gap-2">
//             <label className="text-secondary text-[20px]">
//               {t("helpForm.messageLabel")} <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               rows={6}
//               required
//               className="w-full px-4 py-3 border border-primary r focus:outline-none resize-none"
//             />
//           </div>
//
//           <div className="flex items-center gap-2">
//             <CheckboxWithLabel
//               checked={agreed}
//               onChange={setAgreed}
//               required
//               label="Συμφωνώ με τους"
//               labelLink={{
//                 href: "/3-oroi-xrisis",
//                 text: "Όρους και Προϋποθέσεις",
//               }}
//             />
//           </div>
//
//           <div className="mt-4 flex justify-end">
//             <ReCAPTCHA
//               ref={recaptchaRef}
//               sitekey={siteKey}
//               onChange={(token) => setCaptchaToken(token || "")}
//             />
//           </div>
//
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={loading || !agreed || !email.trim() || !captchaToken}
//               className="bg-primary text-white rounded-[8.49px] hover:opacity-90 transition-opacity disabled:opacity-70 w-[198px] h-[60px]"
//             >
//               {loading ? t("contact.sending") : t("contact.send")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
//
// export default ContactForm
