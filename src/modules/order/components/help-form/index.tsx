"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Headphones,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import { sendOrderMessage } from "@lib/data/orders"

const HelpForm = ({
  orderId,
  displayId,
}: {
  orderId: string
  displayId?: string
}) => {
  const t = useTranslations()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setFormStatus({
        type: "error",
        message: t("helpForm.titleRequired"),
      })
      return
    }

    if (!message.trim()) {
      setFormStatus({
        type: "error",
        message: t("helpForm.messageRequired"),
      })
      return
    }

    setFormStatus({ type: null, message: "" })

    startTransition(async () => {
      const result = await sendOrderMessage(
        orderId,
        message.trim(),
        title.trim()
      )
      if (result.success) {
        setFormStatus({
          type: "success",
          message: result.message || t("helpForm.success"),
        })
        setTitle("")
        setMessage("")
      } else {
        setFormStatus({
          type: "error",
          message:
            result.error || t("helpForm.errorSending"),
        })
      }
    })
  }

  return (
    <div className="my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary2/10 flex items-center justify-center shrink-0">
            <Headphones size={20} className="text-primary2" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
              {t("helpForm.title")}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {t("helpForm.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LocalizedClientLink
            href="/7-epistrofes-proionton"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2 rounded-lg transition-colors"
          >
            {t("helpForm.returnsLink")}
          </LocalizedClientLink>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="help-title"
            className="block text-sm font-semibold text-neutral-700 mb-1.5"
          >
            {t("helpForm.titleLabel")}
          </label>
          <input
            id="help-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("helpForm.titlePlaceholder")}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary2/20 focus:border-primary2 transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="help-message"
            className="block text-sm font-semibold text-neutral-700 mb-1.5"
          >
            {t("helpForm.messageLabel")}
          </label>
          <textarea
            id="help-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("helpForm.messagePlaceholder")}
            rows={8}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary2/20 focus:border-primary2 transition-all resize-y min-h-[180px]"
          />
          <div className="flex justify-end mt-1">
            <span className="text-[10px] text-neutral-400">
              {t("helpForm.characters", { count: message.length })}
            </span>
          </div>
        </div>

        {formStatus.type && (
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${
              formStatus.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {formStatus.type === "success" ? (
              <CheckCircle2 size={16} className="shrink-0" />
            ) : (
              <XCircle size={16} className="shrink-0" />
            )}
            {formStatus.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="group inline-flex items-center gap-2.5 bg-primary text-white text-sm font-semibold px-8 py-3 hover:bg-orange active:scale-[0.98] transition-all w-fit disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" /> {t("helpForm.sending")}
            </>
          ) : (
            <>
              {t("helpForm.send")}{" "}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default HelpForm
