"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { getProductReviews } from "../../../../lib/data/products"
import { Star, StarSolid } from "@medusajs/icons"
import { Button } from "@medusajs/ui"

import { StoreProductReview } from "../../../../types/global"
import ProductReviewsForm from "./form"

import Modal from "@modules/common/components/modal"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { isAuthenticated } from "@lib/data/isUserAuthenticated"
import LoginPromptModal from "@modules/layout/components/login-prompt-modal"

type ProductReviewsProps = {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const t = useTranslations()
  /* ---------------- Auth ---------------- */
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isAuthenticated()
      setIsLoggedIn(loggedIn)
    }
    checkAuth()
  }, [])

  /* ---------------- Reviews ---------------- */
  const [page, setPage] = useState(1)
  const defaultLimit = 10
  const [reviews, setReviews] = useState<StoreProductReview[]>([])
  const [rating, setRating] = useState(0)
  const [hasMoreReviews, setHasMoreReviews] = useState(false)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  async function fetchReviews() {
    setIsLoading(true)

    try {
      const {
        reviews: paginatedReviews,
        average_rating,
        count,
        limit,
      } = await getProductReviews({
        productId,
        limit: defaultLimit,
        offset: (page - 1) * defaultLimit,
      })

      setReviews((prev) => {
        const newReviews = paginatedReviews.filter(
          (review) => !prev.some((r) => r.id === review.id)
        )
        return [...prev, ...newReviews]
      })

      setRating(Math.round(average_rating))
      setHasMoreReviews(count > limit * page)
      setCount(count)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [page])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`
  }

  const showScrollableContainer = reviews.length > 3

  return (
    <div className="relative lg:pr-6">
      {/* Reviews list */}
      <div
        className={`flex flex-col gap-y-6 ${
          showScrollableContainer
            ? "max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            : ""
        }`}
      >
        {reviews.map((review) => (
          <Review key={review.id} review={review} formatDate={formatDate} />
        ))}
      </div>

      {/* Load more */}
      {hasMoreReviews && (
        <div className="flex justify-center mt-8">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => p + 1)}
            disabled={isLoading}
          >
            {isLoading ? t("common.loading") : t("reviews.loadMore")}
          </Button>
        </div>
      )}

      {/* Review form OR login CTA */}
      {isLoggedIn !== null && (
        <div className="mt-5 justify-center">
          {isLoggedIn ? (
            <ProductReviewsForm productId={productId} />
          ) : (
            <div className="flex justify-center">
              <Button
                onClick={() => setShowLoginModal(true)}
                className={
                  "bg-secondary text-white hover:bg-primary outline-none border-primary shadow-none"
                }
                size="xlarge"
              >
                {t("reviews.loginToReview")}
              </Button>
            </div>
          )}
        </div>
      )}

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message={t("reviews.loginRequired")}
      />
    </div>
  )
}

/* ---------------- Review item ---------------- */

function Review({
                  review,
                  formatDate,
                }: {
  review: StoreProductReview
  formatDate: (dateString?: string) => string
}) {
  const t = useTranslations()
  const [isExpanded, setIsExpanded] = useState(false)

  const reviewerName = `${review.first_name || ""} ${
    review.last_name || ""
  }`.trim()

  const reviewDate = review.created_at || review.updated_at
  const displayDate = formatDate(reviewDate)

  const fullCommentText = review.content || ""
  const wordLimit = 20
  const words = fullCommentText.split(/\s+/).filter(Boolean)
  const exceedsLimit = words.length > wordLimit
  const truncatedText = exceedsLimit
    ? words.slice(0, wordLimit).join(" ")
    : fullCommentText

  return (
    <div className="flex flex-col gap-y-1 pb-4 border-b border-gray-300 last:border-b-0">
      <div className="text-secondary text-[20px] font-semibold">
        {reviewerName || t("reviews.anonymous")}
      </div>

      {displayDate && (
        <div className="text-secondary text-[16px]">
          {t("reviews.publishedOn")} {displayDate}
        </div>
      )}

      <div className="flex gap-x-1">
        {Array.from({ length: 5 }).map((_, index) =>
          index < review.rating ? (
            <StarSolid
              key={index}
              className="text-yellow-400 w-5 h-5"
            />
          ) : (
            <Star
              key={index}
              className="text-gray-400 w-5 h-5"
            />
          )
        )}
      </div>

      {fullCommentText && (
        <div className="flex flex-col gap-y-1">
          <div className="text-secondary text-[18px]">
            {isExpanded ? fullCommentText : truncatedText}
            {!isExpanded && exceedsLimit && "..."}
          </div>

          {exceedsLimit && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="text-primary text-[16px] self-start hover:underline"
            >
              {isExpanded ? t("reviews.showLess") : t("reviews.showMore")}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
