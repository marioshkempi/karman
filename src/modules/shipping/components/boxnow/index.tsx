"use client"

import { useEffect, useState } from "react"
import { Button, Input } from "@medusajs/ui"
import { addBoxnowEntry, getBoxnowEntry } from "@lib/data/boxnow"
import Modal from "@modules/common/components/modal"
import { X } from "lucide-react" // adjust import path
import { useTranslations } from "next-intl"

declare global {
  interface Window {
    _bn_map_widget_config: any
  }
}

interface BoxNowMapProps {
  cartid: string
  onLockerSelect?: (lockerId: string) => void
}

const BoxNowMap: React.FC<BoxNowMapProps> = ({ cartid, onLockerSelect }) => {
  const t = useTranslations()
  const [lockerId, setLockerId] = useState("")
  const [lockerName, setLockerName] = useState("")
  const [lockerAddress, setLockerAddress] = useState("")
  const [lockerZip, setLockerZip] = useState("")
  const [lockerText, setLockerText] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [widgetReady, setWidgetReady] = useState(false)

  // Load the widget script once and initialize when modal opens
  useEffect(() => {
    if (!isOpen) return

    window._bn_map_widget_config = {
      // type: "popup",          // renders as embedded iframe inside parentElement
      gps: true,
      partnerId: 0,
      parentElement: "#boxnowmap",
      autoclose: false,
      autoshow: true,
      autoselect: true,
      afterSelect: (selected: any) => {
        const text = `${selected.boxnowLockerName}<br/>${selected.boxnowLockerAddressLine1}, ${selected.boxnowLockerPostalCode}`
        setLockerId(selected.boxnowLockerId)
        setLockerName(selected.boxnowLockerName)
        setLockerAddress(selected.boxnowLockerAddressLine1)
        setLockerZip(selected.boxnowLockerPostalCode)
        setLockerText(text)
        setIsOpen(false)
      },
    }

    // Remove old script to force re-init against the new DOM
    const existingScript = document.querySelector(
      'script[src="https://widget-cdn.boxnow.gr/map-widget/client/v5.js"]'
    )
    if (existingScript) existingScript.remove()

    const script = document.createElement("script")
    script.src = "https://widget-cdn.boxnow.gr/map-widget/client/v5.js"
    script.async = true
    script.onload = () => setWidgetReady(true)
    document.head.appendChild(script)

    return () => {
      const s = document.querySelector(
        'script[src="https://widget-cdn.boxnow.gr/map-widget/client/v5.js"]'
      )
      if (s) s.remove()
      delete window._bn_map_widget_config
      setWidgetReady(false)
    }
  }, [isOpen])

  // Persist selection
  useEffect(() => {
    if (!lockerId) return
    onLockerSelect?.(lockerId)

    const saveLockerSelection = async () => {
      try {
        await addBoxnowEntry(
          cartid,
          "0",
          lockerId,
          lockerName,
          lockerAddress,
          lockerZip,
          null,
          "1",
          0,
          null,
          "0"
        )
      } catch (err) {
        console.error("❌ BoxNow request failed", err)
      }
    }

    saveLockerSelection()
  }, [lockerId])

  // Restore previous selection
  useEffect(() => {
    getBoxnowEntry(cartid).then((data: any) => {
      if (!data?.locker_id) return
      const text = `${data.locker_name}<br/>${data.locker_address}, ${data.locker_post_code}`
      setLockerId(data.locker_id)
      setLockerName(data.locker_name)
      setLockerAddress(data.locker_address)
      setLockerZip(data.locker_post_code)
      setLockerText(text)
    })
  }, [cartid])

  return (
    <div className="delivery-option" id="boxnow-map-container">
      <div className="locker-info-wrapper m-0 p-0 bg-transparent">
        <Button
          className="boxnow-map-widget-button bg-primary shadow-none hover:bg-orange"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          {t("boxnow.selectLocker")}
        </Button>

        {lockerId && (
          <div
            className="selected-boxnow"
            dangerouslySetInnerHTML={{
              __html: `<strong>${t("boxnow.lockerLabel")}:</strong><br/>${lockerText}`,
            }}
          />
        )}
      </div>

      <Modal isOpen={isOpen} close={() => setIsOpen(false)} size="xxlarge">
        <X
          className={"absolute right-0"}
          onClick={() => setIsOpen(false)}
          size={24}
        />

        <Modal.Body>
          <div
            id="boxnowmap"
            style={{ width: "100%" }}
            className="boxnow-map-widget-container min-h-[80vh] md:min-h-[800px]"
          />
          {!widgetReady && (
            <div className="flex items-center justify-center py-10 text-ui-fg-muted">
              {t("checkout.loadingMap")}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Input type="hidden" className="boxnow-id" value={lockerId} readOnly />
      <Input
        type="hidden"
        className="boxnow-name"
        value={lockerName}
        readOnly
      />
      <Input
        type="hidden"
        className="boxnow-address"
        value={lockerAddress}
        readOnly
      />
      <Input type="hidden" className="boxnow-zip" value={lockerZip} readOnly />

      <style jsx>{`
        .locker-info-wrapper {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .boxnow-map-widget-button {
          height: auto !important;
          max-height: 38px;
          white-space: nowrap;
          background-color: #0066cc !important;
          color: white !important;
          font-weight: 600;
        }
        .selected-boxnow {
          background: #ffffff;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 14px;
          line-height: 1.4;
          color: #333;
          flex: 1;
        }
        @media (max-width: 600px) {
          .locker-info-wrapper {
            flex-direction: column;
            align-items: flex-start;
          }
          .selected-boxnow {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default BoxNowMap
