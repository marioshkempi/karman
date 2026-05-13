"use client"

import { Heading, Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import { useTranslations } from "next-intl"

const EmptyCartMessage = () => {
  const t = useTranslations()

  return (
    <div
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
      data-testid="empty-cart-message"
    >
      {/* Cart icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-ui-bg-subtle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-ui-fg-muted"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      </div>

      <Heading level="h1" className="text-2xl font-semibold text-ui-fg-base">
        {t("cart.empty")}
      </Heading>

      <Text className="mt-3 mb-8 max-w-md text-ui-fg-subtle text-base leading-relaxed">
        {t("cart.emptyMessage")}
      </Text>

      <InteractiveLink href="/store">
        {t("cart.exploreProducts")}
      </InteractiveLink>
    </div>
  )
}

export default EmptyCartMessage
