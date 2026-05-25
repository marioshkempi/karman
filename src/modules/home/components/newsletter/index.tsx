"use client"

import { useState } from "react"
import { subscribeToNewsletter } from "@lib/data/newsletter"
import Alert from "@modules/common/components/alerts/alert"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const response = await subscribeToNewsletter({ email })

      if (response.success) {
        setSuccess("Επιτυχής εγγραφή στο newsletter!")
        setEmail("")
        setAgreed(false)
      } else {
        setError(
          response.message || "Αποτυχία εγγραφής. Παρακαλώ δοκιμάστε ξανά."
        )
      }
    } catch (err: any) {
      setError(err.message || "Αποτυχία εγγραφής. Παρακαλώ δοκιμάστε ξανά.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F1F5F9] py-6 md:py-8 px-4">
      <div className="max-w-[1282px] mx-auto">
        {/* Desktop: pill shape */}
        <div className="hidden lg:block bg-[#112F82] rounded-[99px] px-12 h-[108px]">
          <div className="h-full flex items-center">
            {success && <Alert type="success" message={success} className="mb-4" />}
            {error && <Alert type="danger" message={error} className="mb-4" />}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex items-center justify-between gap-6">
                {/* Left side - Title and checkbox */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-white text-2xl font-semibold">
                    Εγγραφείτε στο newsletter της Karman!
                  </h2>
                  <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 rounded border-white/30 bg-transparent"
                    />
                    <span>
                      Συμφωνώ με τους{" "}
                      <LocalizedClientLink
                        href={"/3-oroi-xrisis"}
                        className="underline text-[#4a9eff] hover:text-white"
                      >
                        Όρους & Προϋποθέσεις
                      </LocalizedClientLink>
                      {" "}και την{" "}
                      <LocalizedClientLink
                        href={"/prosopika-dedomena"}
                        className="underline text-[#4a9eff] hover:text-white"
                      >
                        Πολιτική Απορρήτου & Cookies
                      </LocalizedClientLink>
                      .
                    </span>
                  </label>
                </div>

                {/* Right side - Email input and button */}
                <div className="flex gap-3 min-w-[450px]">
                  <input
                    type="email"
                    placeholder="Το email σας"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-white/40 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading || !agreed || !email.trim()}
                    className="px-8 py-3 bg-white text-[#112F82] font-semibold rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Εγγραφή..." : "Εγγραφή"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile: compact vertical layout matching Screenshot_371 */}
        <div className="lg:hidden bg-[#112F82] rounded-2xl px-5 py-5">
          {success && <Alert type="success" message={success} className="mb-3" />}
          {error && <Alert type="danger" message={error} className="mb-3" />}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <h2 className="text-white text-lg font-semibold mb-3 text-center">
              Εγγραφείτε στο newsletter της Karman!
            </h2>

            {/* Checkbox */}
            <label className="flex items-start gap-2 text-xs text-white/80 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-white/30 bg-transparent flex-shrink-0"
              />
              <span>
                Συμφωνώ με τους{" "}
                <LocalizedClientLink
                  href={"/3-oroi-xrisis"}
                  className="underline text-[#4a9eff]"
                >
                  Όρους & Προϋποθέσεις
                </LocalizedClientLink>
                {" "}και την{" "}
                <LocalizedClientLink
                  href={"/prosopika-dedomena"}
                  className="underline text-[#4a9eff]"
                >
                  Πολιτική Απορρήτου & Cookies
                </LocalizedClientLink>
                .
              </span>
            </label>

            {/* Email input and button - side by side */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Το email σας"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="flex-1 min-w-0 px-4 py-2.5 bg-white/10 border border-white/20 rounded-full text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !agreed || !email.trim()}
                className="px-5 py-2.5 bg-white text-[#112F82] font-semibold text-sm rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Εγγραφή"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
