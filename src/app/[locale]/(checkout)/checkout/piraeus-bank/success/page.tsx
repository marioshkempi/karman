import { Suspense } from "react"
import Spinner from "@modules/common/icons/spinner"
import PiraeusBankSuccessHandler from "@modules/checkout/components/piraeus-bank/piraeus-bank-success-handler"
import { getTranslations } from "next-intl/server"

// Force dynamic rendering - this page cannot be statically generated
// because it relies on URL search params from the bank callback
export const dynamic = "force-dynamic"

async function LoadingFallback() {
  const t = await getTranslations()
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-gray-600">{t("common.loading")}</p>
      </div>
    </div>
  )
}

export default function PiraeusBankSuccessPage() {
  return (
    <div className="content-container py-8">
      <Suspense fallback={<LoadingFallback />}>
        <PiraeusBankSuccessHandler />
      </Suspense>
    </div>
  )
}
