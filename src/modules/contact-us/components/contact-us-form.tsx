"use client"
import React, { useState, useRef, useEffect } from "react"
import CaptchaWidget, { CaptchaWidgetRef } from "@modules/captcha"

import Breadcrumb from "@modules/common/components/breadcrumb"
import Alert from "@modules/common/components/alerts/alert"
import { addContactFormEntry } from "@lib/data/contact-form"
import CheckboxWithLabel from "@modules/common/components/checkbox"
import { useCaptchaConfig } from "@modules/captcha/captcha-context"
import { useTranslations } from "next-intl"
import { Phone, Mail, MapPin } from "lucide-react"

interface ContactFormProps {
  customer?: any
}

const ContactForm = ({ customer }: ContactFormProps) => {
  const t = useTranslations()
  const captchaConfig = useCaptchaConfig()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [subject, setSubject] = useState("general")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
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
    if (customer?.first_name) setFirstName(customer.first_name)
    if (customer?.last_name) setLastName(customer.last_name)
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
      setSubject("general")
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
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
    <div className="bg-[#F1F5F9] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb showEllipsis ellipsisPosition={1} lastLabel={t("navigation.contact")} />
      </div>

      {/* Main Content */}
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="flex flex-col lg:flex-row">
            {/* Left Panel - Contact Info */}
            <div 
              className="lg:w-[380px] p-6 lg:p-10 relative overflow-hidden"
              style={{ background: "#06212B" }}
            >
              {/* Decorative circles */}
              <div className="absolute bottom-0 right-0 w-[180px] h-[180px] rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />
              <div className="absolute bottom-20 right-10 w-[100px] h-[100px] rounded-full bg-white/5" />
              
              <div className="relative z-10">
                <h2 className="text-white text-[28px] lg:text-[32px] font-bold mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Επικοινωνία
                </h2>
                <p className="text-white/70 text-[14px] mb-8">
                  Say something to start a live chat!
                </p>

                {/* Contact Details */}
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone size={20} className="text-white" />
                    </div>
                    <div className="text-white text-[14px] leading-relaxed">
                      <p>2311263836</p>
                      <p>6936800257</p>
                      <p>6930571431</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-white" />
                    </div>
                    <span className="text-white text-[14px]">info@karman.com</span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div className="text-white text-[14px] leading-relaxed">
                      <p>Ειρήνης 31 Εύοσμος</p>
                      <p>Θεσσαλονίκη 56226</p>
                    </div>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3 mt-10 lg:mt-20">
                  <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 p-6 lg:p-10">
              {success && <Alert type="success" message={success} />}
              {error && <Alert type="danger" message={error} />}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-500 text-[13px] mb-1">Όνομα</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border-b border-gray-300 py-2 text-[15px] text-gray-900 focus:outline-none focus:border-[#007BFF] transition-colors bg-transparent"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[13px] mb-1">Επώνυμο</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border-b border-gray-300 py-2 text-[15px] text-gray-900 focus:outline-none focus:border-[#007BFF] transition-colors bg-transparent"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-500 text-[13px] mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border-b border-gray-300 py-2 text-[15px] text-gray-900 focus:outline-none focus:border-[#007BFF] transition-colors bg-transparent"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[13px] mb-1">Τηλέφωνο</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border-b border-gray-300 py-2 text-[15px] text-gray-900 focus:outline-none focus:border-[#007BFF] transition-colors bg-transparent"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Subject Radio Options */}
                <div>
                  <label className="block text-gray-700 text-[15px] font-medium mb-4">Επιλέξτε Θέμα</label>
                  <div className="flex flex-wrap gap-4 lg:gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subject"
                        value="general"
                        checked={subject === "general"}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                      />
                      <span className="text-[14px] text-gray-700">Γενικές Πληροφορίες</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subject"
                        value="support"
                        checked={subject === "support"}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                      />
                      <span className="text-[14px] text-gray-700">Τεχνική Υποστήριξη</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subject"
                        value="feedback"
                        checked={subject === "feedback"}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-0"
                      />
                      <span className="text-[14px] text-gray-700">Συνεργασίες</span>
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-500 text-[13px] mb-1">Μήνυμα</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    required
                    className="w-full border-b border-gray-300 py-2 text-[15px] text-gray-900 focus:outline-none focus:border-[#007BFF] transition-colors bg-transparent resize-none"
                    placeholder="Γράψτε το μήνυμά σας..."
                  />
                </div>

                {/* Terms Checkbox */}
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

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
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
                    className="bg-[#007BFF] text-white rounded-lg hover:bg-[#0069d9] transition-colors disabled:opacity-70 px-10 py-3.5 text-[15px] font-medium"
                  >
                    {loading ? t("contact.sending") : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
