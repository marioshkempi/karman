"use client"

import { useEffect, useState } from "react"
import X from "@modules/common/icons/x"
import { InvoicePayload } from "@lib/data/invoice"
import Input from "@modules/common/components/input"

interface InvoiceFormProps {
  cart: any
  existingInvoice: InvoicePayload | null
}

const InvoiceForm = ({ cart, existingInvoice }: InvoiceFormProps) => {
  const [invoice, setInvoice] = useState<InvoicePayload>({})
  const [isValid, setIsValid] = useState(false)
  const [isValidatingAFM, setIsValidatingAFM] = useState(false)
  const [afmDirty, setAfmDirty] = useState(false)
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle")
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    if (existingInvoice) {
      setInvoice(existingInvoice)
      setIsValid(!!existingInvoice.afm)
      setAfmDirty(false)
    }
  }, [existingInvoice, cart?.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "afm") {
      setAfmDirty(true)
      setIsValid(false)
    }
    setInvoice((prev) => ({ ...prev, [name]: value }))
  }

  const saveInvoice = async (data: InvoicePayload) => {
    setSaveStatus("saving")
    setSaveMessage(null)
    try {
      const res = await fetch(`/api/invoice/${cart.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (res.ok) {
        setSaveStatus("saved")
      } else {
        setSaveStatus("error")
      }
    } catch (err: any) {
      setSaveStatus("error")
      setSaveMessage(err.message || "Άγνωστο σφάλμα")
    }
  }

  useEffect(() => {
    if (!afmDirty) return
    const afm = invoice.afm
    if (!afm || afm.length !== 9) {
      setIsValid(false)
      return
    }

    const validateAFM = async () => {
      setIsValidatingAFM(true)
      try {
        const res = await fetch("/api/aade-validator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ afm }),
        })
        const parsed = await res.json()

        if (parsed.success && parsed.data) {
          const aadeData = parsed.data
          const populated: InvoicePayload = {
            ...invoice,
            afm,
            onomasia: aadeData.onomasia ?? invoice.onomasia,
            commer_title: aadeData.commer_title ?? invoice.commer_title,
            doy: aadeData.doy ?? invoice.doy,
            doy_descr: aadeData.doy_descr ?? invoice.doy_descr,
            postal_address: aadeData.postal_address ?? invoice.postal_address,
            postal_address_no:
              aadeData.postal_address_no ?? invoice.postal_address_no,
            postal_zip_code:
              aadeData.postal_zip_code ?? invoice.postal_zip_code,
            postal_area_description:
              aadeData.postal_area_description ??
              invoice.postal_area_description,
            legal_status_descr:
              aadeData.legal_status_descr ?? invoice.legal_status_descr,
            firm_flag_descr:
              aadeData.firm_flag_descr ?? invoice.firm_flag_descr,
            i_ni_flag_descr:
              aadeData.i_ni_flag_descr ?? invoice.i_ni_flag_descr,
            deactivation_flag:
              aadeData.deactivation_flag ?? invoice.deactivation_flag,
            deactivation_flag_descr:
              aadeData.deactivation_flag_descr ??
              invoice.deactivation_flag_descr,
            normal_vat_system_flag:
              aadeData.normal_vat_system_flag ?? invoice.normal_vat_system_flag,
          }

          setInvoice(populated)
          setIsValid(true)
          await saveInvoice(populated)
        } else {
          setIsValid(false)
        }
      } catch (err) {
        console.error("AFM validation error:", err)
        setIsValid(false)
      } finally {
        setIsValidatingAFM(false)
      }
    }

    validateAFM()
  }, [invoice.afm, afmDirty])

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "afm") return
    if (!isValid) return
    saveInvoice(invoice)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300 mt-5">
      <div className="relative">
        <Input
          label="ΑΦΜ"
          name="afm"
          value={invoice.afm || ""}
          onChange={handleChange}
          required
        />
        {isValidatingAFM && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange border-t-transparent" />
          </div>
        )}
      </div>

      <Input
        label="Επωνυμία"
        name="onomasia"
        value={invoice.onomasia || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />

      <Input
        label="Οδός"
        name="postal_address"
        value={invoice.postal_address || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />

      <Input
        label="Αριθμός"
        name="postal_address_no"
        value={invoice.postal_address_no || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />

      <Input
        label="ΤΚ"
        name="postal_zip_code"
        value={invoice.postal_zip_code || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />

      <Input
        label="Πόλη"
        name="postal_area_description"
        value={invoice.postal_area_description || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />

      <Input
        label="ΔΟΥ"
        name="doy"
        value={invoice.doy || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />

      <Input
        label="Περιγραφή ΔΟΥ"
        name="doy_descr"
        value={invoice.doy_descr || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {invoice.afm &&
        !isValidatingAFM &&
        (isValid ? (
          <div className="md:col-span-2 flex items-center text-green-600 text-sm font-semibold py-2">
            <span className="mr-2">✓</span>
            Έγκυρο ΑΦΜ
          </div>
        ) : (
          <div className="md:col-span-2 flex items-center gap-1 text-red-600 text-sm font-semibold py-2">
            <X size={15} />
            Μη έγκυρο ΑΦΜ — ελέγξτε και ξαναπροσπαθήστε
          </div>
        ))}
    </div>
  )
}

export default InvoiceForm
