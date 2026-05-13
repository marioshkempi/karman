import { Suspense } from "react"
import BannerSection from "@modules/common/components/banner-section"

const TestTemplate = ({
  searchParams,
}: {
  searchParams?: Record<string, string>
}) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-3">

        <Suspense fallback={<div className="h-48 bg-gray-200 animate-pulse rounded-lg mb-6" />}>
          <BannerSection queryParams={searchParams} />
        </Suspense>

      </div>
    </div>
  )
}

export default TestTemplate
