"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@medusajs/ui"
import { addSlmEntry } from "@lib/data/slmshipping"
import Modal from "@modules/common/components/modal"
import { X } from "lucide-react"

declare global {
  interface Window {
    _skroutzPointsMapWidgetOptions: any
    slmshippingLockerSelected: (selected: any) => void
  }
}

interface SlmMapProps {
  cartId: string
  partnerId: string
  mapScriptUrl: string
  lockerId?: string
  language?: "el" | "en"
  onLockerSelect?: (lockerId: string) => void
}

const SlmMap: React.FC<SlmMapProps> = ({
                                         cartId,
                                         partnerId,
                                         mapScriptUrl,
                                         lockerId = "",
                                         language = "el",
                                         onLockerSelect,
                                       }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLockerId, setSelectedLockerId] = useState("")
  const [numericId, setNumericId] = useState("")
  const [name, setName] = useState("")
  const [latinName, setLatinName] = useState("")
  const [latinAddress, setLatinAddress] = useState("")
  const [streetName, setStreetName] = useState("")
  const [streetNumber, setStreetNumber] = useState("")
  const [zip, setZip] = useState("")
  const [city, setCity] = useState("")
  const [latinCity, setLatinCity] = useState("")
  const [region, setRegion] = useState("")

  // Register global callback once on mount
  useEffect(() => {
    window.slmshippingLockerSelected = (selected: any) => {
      setSelectedLockerId(selected.id ?? selected.locker_id ?? selected.lockerId ?? "")
      setNumericId(selected.numeric_id ?? "")
      setName(selected.name ?? "")
      setLatinName(selected.latin_name ?? "")
      setLatinAddress(selected.latin_address ?? "")
      setStreetName(selected.street_name ?? "")
      setStreetNumber(selected.street_number ?? "")
      setZip(selected.zip ?? "")
      setCity(selected.city ?? "")
      setLatinCity(selected.latin_city ?? "")
      setRegion(selected.region ?? "")
      setIsOpen(false)
    }
  }, [])

  // Every time the modal opens: clear the container, remove the old script,
  // then re-inject it so the widget re-initialises into a fresh DOM element.
  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      const mapEl = document.getElementById("slmLockerMap")
      if (mapEl) mapEl.innerHTML = ""

      const oldScript = document.querySelector(`script[src="${mapScriptUrl}"]`)
      if (oldScript) oldScript.remove()

      window._skroutzPointsMapWidgetOptions = {
        lockerId,
        partnerId,
        language,
        type: "iframe",
        parentElement: "#slmLockerMap",
        afterSelect: (selected: any) => {
          window.slmshippingLockerSelected(selected)
        },
      }

      const script = document.createElement("script")
      script.src = mapScriptUrl
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }, 350)

    return () => clearTimeout(timer)
  }, [isOpen])

  // Save to DB when locker is picked — useEffect callback must not be async,
  // so we define an inner async function and call it
  useEffect(() => {
    if (!selectedLockerId) return

    onLockerSelect?.(selectedLockerId)

    const save = async () => {
      try {
        await addSlmEntry(
          cartId, selectedLockerId, numericId, name, latinName,
          latinAddress, streetName, streetNumber, zip, city, latinCity, region,
        )
      } catch (err) {
        console.error("SLM locker save failed", err)
      }
    }

    save()
  }, [selectedLockerId])

  return (
    <div className="slm-container">

      <Button
        type="button"
        className="slm-pick-button bg-primary shadow-none hover:bg-orange"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(true)
        }}
      >
        {selectedLockerId
          ? language === "el" ? "Αλλαγή Σημείου" : "Change Point"
          : language === "el" ? "Επιλογή Σημείου Παραλαβής" : "Choose Pickup Point"}
      </Button>

      {selectedLockerId && (
        <div className="slm-selected-info">
          <strong>{language === "el" ? "Σημείο Παραλαβής:" : "Selected Point:"}</strong>{" "}
          {name}
          {latinAddress && <><br /><span className="slm-address">{latinAddress}</span></>}
          {zip && city && <><br /><span className="slm-city">{zip} {latinCity || city}</span></>}
        </div>
      )}

      <Modal isOpen={isOpen} close={() => setIsOpen(false)} size="xxlarge">
        <X className={"absolute right-0"} onClick={() => setIsOpen(false)} size={24}/>
        <Modal.Body>
          <div
            id="slmLockerMap"
            style={{ width: "100%", height: "70vh", minHeight: "500px" }}
          />
        </Modal.Body>
      </Modal>

      <input type="hidden" name="slm_locker_id" value={selectedLockerId} readOnly />
      <input type="hidden" name="slm_numeric_id" value={numericId} readOnly />
      <input type="hidden" name="slm_name" value={name} readOnly />
      <input type="hidden" name="slm_latin_name" value={latinName} readOnly />
      <input type="hidden" name="slm_latin_address" value={latinAddress} readOnly />
      <input type="hidden" name="slm_street_name" value={streetName} readOnly />
      <input type="hidden" name="slm_street_number" value={streetNumber} readOnly />
      <input type="hidden" name="slm_zip" value={zip} readOnly />
      <input type="hidden" name="slm_city" value={city} readOnly />
      <input type="hidden" name="slm_latin_city" value={latinCity} readOnly />
      <input type="hidden" name="slm_region" value={region} readOnly />

      <style jsx>{`
          .slm-container {
              width: 100%;
          }

          .slm-pick-button {
              height: auto !important;
              max-height: 38px;
              white-space: nowrap;
              background-color: #f5a623 !important;
              color: #1a1a1a !important;
              font-weight: 600;
              box-shadow: none !important;
          }

          .slm-pick-button:hover {
              background-color: #e8951a !important;
          }

          .slm-selected-info {
              background: #ffffff;
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 8px 12px;
              font-size: 14px;
              line-height: 1.5;
              color: #333;
              margin-top: 8px;
          }

          .slm-address, .slm-city {
              color: #666;
              font-size: 13px;
          }

          #slmLockerMap iframe {
              width: 100% !important;
              height: 100% !important;
          }
      `}</style>
    </div>
  )
}

export default SlmMap