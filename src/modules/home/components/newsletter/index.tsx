"use client"

import { useState } from "react"
import { subscribeToNewsletter } from "@lib/data/newsletter"
import Alert from "@modules/common/components/alerts/alert"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [agreed, setAgreed] = useState(false) // New state for terms checkbox
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
    <div className="bg-lightyellow py-12 lg:py-16 px-4">
      <div className="max-w-[1350px] mx-auto">
        <h2 className="text-[25px] lg:text-[35px] text-secondary font-normal mb-6 lg:mb-8">
          Γραφτείτε στο Newsletter μας
        </h2>

        {success && <Alert type="success" message={success} className="mb-6" />}
        {error && <Alert type="danger" message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="mb-6 lg:mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2 sm:gap-4">
              <input
                type="email"
                placeholder="Η διεύθυνση email σας"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-white border-2 border-primary placeholder-primary text-primary focus:outline-none focus:border-primary rounded text-sm sm:text-base disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !agreed || !email.trim()} // Disabled if not agreed or email empty
                className="px-8 lg:px-16 py-2 bg-white text-secondary border-secondary border text-[12px] sm:text-[14px] lg:text-[22px] font-semibold rounded hover:bg-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors"
              >
                {loading ? "Εγγραφή..." : "Εγγραφή"}
              </button>
            </div>

            {/* Terms & Conditions Checkbox */}
            <label className="flex items-center gap-2 text-sm sm:text-base text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4"
              />
              Συμφωνώ με τους{" "}
              <LocalizedClientLink
                href={"/3-oroi-xrisis"}
                className="underline"
              >
                Όρους και Προϋποθέσεις
              </LocalizedClientLink>
            </label>
          </div>
        </form>

        <p className="text-[14px] lg:text-[20px] text-secondary max-w-5xl">
          Μπορείτε να ακυρώσετε την εγγραφή σας στο ενημερωτικό δελτίο
          οποτεδήποτε.
          <br />
          Για να δείτε πώς, ανατρέξτε στα στοιχεία επικοινωνίας στην Ανακοίνωση
          Νομικού Περιεχομένου.
        </p>
      </div>
    </div>
  )
}
