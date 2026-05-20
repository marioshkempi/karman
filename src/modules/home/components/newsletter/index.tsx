"use client"

import { useState } from "react"
import { subscribeToNewsletter } from "@lib/data/newsletter"
import Alert from "@modules/common/components/alerts/alert"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const NEWSLETTER_BG = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Newsletter-background-bj7nt9DJgniaZki60neDzWZ59M3ZW2.jpg"

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
    <section className="relative min-h-[220px] overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${NEWSLETTER_BG})` }}
      />
      
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left side - Text content */}
          <div className="lg:w-1/2">
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Subscribe to the Newsletter
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-md">
              by clicking on the &quot;subscribe&quot; button, I express my free and express consent to receive newsletters and information.
            </p>
          </div>
          
          {/* Right side - Form */}
          <div className="lg:w-1/2">
            {success && <Alert type="success" message={success} className="mb-4" />}
            {error && <Alert type="danger" message={error} className="mb-4" />}

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                {/* Input and button row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="flex-1 min-w-0 px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading || !agreed || !email.trim()}
                    className="px-8 py-3 bg-red-600 text-white font-semibold text-sm uppercase tracking-wide hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? "..." : "SUBSCRIBE"}
                  </button>
                </div>

                {/* Consent checkbox */}
                <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 border-gray-400 bg-transparent"
                  />
                  <span>
                    by clicking on the &quot;subscribe&quot; button, I express my free and express consent to receive newsletters and information.
                  </span>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
