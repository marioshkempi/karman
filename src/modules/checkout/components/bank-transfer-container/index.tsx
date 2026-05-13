"use client"

import { Text, clx } from "@medusajs/ui"
import React, { type JSX } from "react"
import Select, { type StylesConfig, type SingleValue } from "react-select"
import { useTranslations } from "next-intl"

type EnrichedPaymentProvider = {
  id: string
  display_name: string | null
  description: string | null
  image_url: string | null
  extra_content: string | null
}

type BankOption = {
  value: string
  label: string
  image_url: string | null
}

type BankTransferContainerProps = {
  parentProvider: EnrichedPaymentProvider | null
  subProviders: EnrichedPaymentProvider[]
  selectedPaymentOptionId: string
  selectedBankId: string
  onGroupSelect: () => void
  onBankChange: (providerId: string) => void
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  CustomRadio?: React.ComponentType<{
    checked: boolean
    "data-testid"?: string
  }>
  feeBadge?: React.ReactNode
  feeBreakdown?: React.ReactNode
  disabled?: boolean
}

// ── Helpers ──────────────────────────────────────────────────────
const isBankTransfer = (id: string) => id.includes("bank-transfer")
const isBankTransferSub = (id: string) => /bank-transfer-[a-z]/i.test(id)
const isBankTransferParent = (id: string) =>
  isBankTransfer(id) && !isBankTransferSub(id)

// ── react-select custom option with bank logo ────────────────────
const BankOptionLabel = ({ label, image_url }: BankOption) => (
  <div className="flex items-center gap-2.5">
    {image_url && (
      <img
        src={image_url}
        alt={label}
        className="h-5 w-auto max-w-[60px] object-contain"
      />
    )}
    <span>{label}</span>
  </div>
)

// ── react-select styles matching the design ──────────────────────
const selectStyles: StylesConfig<BankOption, false> = {
  control: (base: any, state: any) => ({
    ...base,
    borderWidth: "2px",
    borderColor: state.isFocused ? "var(--color-orange, #f97316)" : "#e5e7eb",
    borderRadius: "0.5rem",
    padding: "2px 4px",
    fontSize: "14px",
    backgroundColor: "#fff",
    boxShadow: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    "&:hover": {
      borderColor: state.isFocused ? "var(--color-orange, #f97316)" : "#d1d5db",
    },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "14px",
    padding: "10px 12px",
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "rgba(249, 115, 22, 0.08)"
      : state.isFocused
      ? "rgba(249, 115, 22, 0.04)"
      : "#fff",
    color: "#000",
    "&:active": {
      backgroundColor: "rgba(249, 115, 22, 0.12)",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "#000",
    fontSize: "14px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "14px",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.5rem",
    overflow: "hidden",
    border: "2px solid #e5e7eb",
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: "#6b7280",
    padding: "0 8px",
    transition: "transform 0.2s",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
    "&:hover": { color: "#374151" },
  }),
}

// ─────────────────────────────────────────────────────────────────

const BankTransferContainer: React.FC<BankTransferContainerProps> = ({
  parentProvider,
  subProviders,
  selectedPaymentOptionId,
  selectedBankId,
  onGroupSelect,
  onBankChange,
  paymentInfoMap,
  CustomRadio,
  feeBadge,
  feeBreakdown,
  disabled = false,
}) => {
  const t = useTranslations()
  const checked = isBankTransfer(selectedPaymentOptionId)
  const RadioComponent = CustomRadio || (() => null)

  const displayName = parentProvider?.display_name || t("checkout.bankTransferFallback")
  const description = parentProvider?.description
  const imageUrl = parentProvider?.image_url
  const groupExtraContent = parentProvider?.extra_content

  const parentId = parentProvider?.id ?? ""
  const fallbackIcon = paymentInfoMap[parentId]?.icon ?? null

  const selectedSubProvider = subProviders.find((p) => p.id === selectedBankId)

  const activeExtraContent =
    selectedSubProvider?.extra_content || groupExtraContent || null

  // ── react-select options ────────────────────────────────────────
  const bankOptions: BankOption[] = subProviders.map((bank) => ({
    value: bank.id,
    label: bank.display_name ?? bank.id,
    image_url: bank.image_url,
  }))

  const selectedOption =
    bankOptions.find((o) => o.value === selectedBankId) ?? null

  const handleSelectChange = (option: SingleValue<BankOption>) => {
    if (option) {
      onBankChange(option.value)
    }
  }

  return (
    <div
      className={clx("rounded-lg border transition-all overflow-hidden mb-2", {
        "border-primary bg-primary/[0.03]": checked,
        "border-black bg-white hover:border-gray-300": !checked && !disabled,
        "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed": disabled,
      })}
    >
      <div
        onClick={disabled ? undefined : onGroupSelect}
        className={clx("flex items-center justify-between py-3.5 px-8", {
          "cursor-pointer": !disabled,
        })}
      >
        <div className="flex items-center gap-3">
          <RadioComponent checked={checked} />
          <div className="flex items-center gap-2.5">
            <span className="text-[14px] text-black font-medium">
              {displayName}
            </span>
            {feeBadge}
          </div>
        </div>

        <span className="justify-self-end text-black flex-shrink-0 ml-4">
          {(() => {
            const selectedImg = selectedSubProvider?.image_url
            const parentImg = imageUrl
            const img = selectedImg || parentImg

            if (img) {
              return (
                <img
                  src={img}
                  alt={selectedSubProvider?.display_name || displayName}
                  className="h-8 w-auto max-w-[100px] object-contain"
                />
              )
            }
            return fallbackIcon
          })()}
        </span>
      </div>

      {/* ── Expanded content (only when checked) ──────────────────── */}
      {checked && (
        <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-gray-100">
          {description && (
            <p className="text-[13px] text-gray-500 mb-3">{description}</p>
          )}

          {activeExtraContent && (
            <div
              className="text-[13px] text-gray-600 prose prose-sm max-w-none
                       prose-p:my-1 prose-ul:my-1 prose-li:my-0
                       mb-3p-2 border-gray-100"
              dangerouslySetInnerHTML={{ __html: activeExtraContent }}
            />
          )}

          {subProviders.length > 0 && (
            <div onClick={(e) => e.stopPropagation()}>
              <p className="text-[13px] text-gray-500 mb-2">
                {t("checkout.selectBankLabel")}
              </p>
              <Select<BankOption, false>
                value={selectedOption}
                onChange={handleSelectChange}
                options={bankOptions}
                placeholder={t("checkout.bankSelectPlaceholder")}
                isSearchable={false}
                styles={selectStyles}
                formatOptionLabel={BankOptionLabel}
                menuPlacement="auto"
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
                classNamePrefix="bank-select"
              />
            </div>
          )}

          {feeBreakdown}
        </div>
      )}
    </div>
  )
}

export default BankTransferContainer
export { isBankTransfer, isBankTransferSub, isBankTransferParent }
