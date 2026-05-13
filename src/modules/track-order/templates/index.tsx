"use client"

import Breadcrumb from "@modules/common/components/breadcrumb"
import { useState } from "react"
import Input from "@modules/common/components/input"
import {
  lookupByOrder,
  lookupByTrackingNumber,
  TrackingResponse,
} from "@lib/data/tracking"
import { useTranslations } from "next-intl"

export default function TrackOrderTemplate() {
  const t = useTranslations()
  const [orderNumber, setOrderNumber] = useState("")
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [result, setResult] = useState<TrackingResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setError(null)
    setResult(null)
  }

  const handleResult = (data: TrackingResponse | null) => {
    if (!data) {
      setError(t("trackOrder.noResults"))
      return
    }

    const allLabels = data.tracking.flatMap((f) => f.labels)
    if (allLabels.length === 1 && allLabels[0].tracking_url) {
      window.open(allLabels[0].tracking_url, "_blank", "noopener,noreferrer")
      return
    }

    setResult(data)
  }

  const handleTrackByOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    reset()
    setLoading(true)

    try {
      const data = await lookupByOrder(orderNumber, emailOrPhone)
      console.log(data)
      handleResult(data)
    } catch {
      setError(t("trackOrder.error"))
    } finally {
      setLoading(false)
    }
  }

  const handleTrackByTracking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return
    reset()
    setLoading(true)

    try {
      const data = await lookupByTrackingNumber(trackingNumber)
      handleResult(data)
    } catch {
      setError(t("trackOrder.error"))
    } finally {
      setLoading(false)
    }
  }

  const handleRedirect = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <Breadcrumb
        showEllipsis={true}
        ellipsisPosition={1}
        lastLabel={t("trackOrder.title")}
      />

      <div className="mt-8">
        <h1 className="text-black text-[20px] font-bold mb-4">
          {t("trackOrder.title")}
        </h1>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-[4px] mb-3">
            <p className="text-red-600 text-[14px]">{error}</p>
          </div>
        )}

        <div className="border border-[#D9D9D9] rounded-[4px] p-8 md:p-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-24">
            <div className="flex flex-col gap-4 md:py-[70px] md:px-[80px]">
              <form
                onSubmit={handleTrackByOrder}
                className="flex flex-col gap-4"
              >
                <Input
                  type="text"
                  placeholder={t("trackOrder.orderNumber")}
                  value={orderNumber}
                  onChange={(e: any) => setOrderNumber(e.target.value)}
                  className="w-full border-primary border text-gray-700 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-labelGray"
                />
                <Input
                  type="text"
                  placeholder={t("trackOrder.emailOrPhone")}
                  value={emailOrPhone}
                  onChange={(e: any) => setEmailOrPhone(e.target.value)}
                  className="w-full border-primary border text-gray-700 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-labelGray"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:opacity-90 text-white font-medium py-3 rounded-sm transition-opacity mt-2 disabled:opacity-50"
                >
                  {loading ? t("trackOrder.searching") : t("trackOrder.search")}
                </button>
              </form>
            </div>

            <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-gray-300 transform -translate-x-1/2">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white py-2 px-1">
                <span className="text-labelGray font-medium text-[25px]">
                  {t("trackOrder.or")}
                </span>
              </div>
            </div>

            <div className="md:hidden relative flex items-center justify-center py-4">
              <div className="w-full h-px bg-gray-300 absolute"></div>
              <span className="bg-white px-3 relative z-10 text-labelGray font-medium text-[25px]">
                {t("trackOrder.or")}
              </span>
            </div>

            <div className="flex flex-col gap-4 md:py-[70px] md:px-[80px]">
              <form
                onSubmit={handleTrackByTracking}
                className="flex flex-col gap-4"
              >
                <Input
                  type="text"
                  placeholder={t("trackOrder.trackingNumber")}
                  value={trackingNumber}
                  onChange={(e: any) => setTrackingNumber(e.target.value)}
                  className="w-full border-primary border text-gray-700 px-4 py-3 rounded-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-labelGray"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:opacity-90 text-white font-medium py-3 rounded-sm transition-opacity mt-2 disabled:opacity-50"
                >
                  {loading ? t("trackOrder.searching") : t("trackOrder.search")}
                </button>
              </form>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-6 border border-[#D9D9D9] rounded-[4px] p-6">
            {result.display_id && (
              <h2 className="text-black text-[18px] font-bold mb-4">
                {t("trackOrder.orderTitle", { id: result.display_id })}
              </h2>
            )}
            {result.tracking.length === 0 ? (
              <p className="text-[14px] text-gray-500">
                {t("trackOrder.noShippingDetails")}
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {result.tracking.map((fulfillment: any) =>
                  fulfillment.labels.map((label: any) => (
                    <div
                      key={label.tracking_number}
                      className="flex items-center justify-between bg-[#EDEFF5] rounded-[4px] p-4"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] text-black font-bold">
                          {t("trackOrder.shipmentNumber")}
                        </span>
                        <span className="text-[14px] text-black">
                          {label.tracking_number}
                        </span>
                        {fulfillment.shipped_at && (
                          <span className="text-[12px] text-gray-500">
                            {t("trackOrder.shipped")}{" "}
                            {new Date(
                              fulfillment.shipped_at
                            ).toLocaleDateString("el-GR")}
                          </span>
                        )}
                        {fulfillment.delivered_at && (
                          <span className="text-[12px] text-gray-500">
                            {t("trackOrder.delivered")}{" "}
                            {new Date(
                              fulfillment.delivered_at
                            ).toLocaleDateString("el-GR")}
                          </span>
                        )}
                      </div>
                      {label.tracking_url ? (
                        <button
                          onClick={() => handleRedirect(label.tracking_url!)}
                          className="bg-primary text-white text-[14px] font-bold px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
                        >
                          {t("trackOrder.track")}
                        </button>
                      ) : (
                        <span className="text-[14px] text-gray-400">
                          {t("trackOrder.notAvailable")}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
