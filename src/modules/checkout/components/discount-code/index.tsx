"use client"

import { Badge, Heading, Text } from "@medusajs/ui"
import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import Input from "@modules/common/components/input"
import { useTranslations } from "next-intl"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
  paddingX?: string
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart, paddingX = "px-4" }) => {
  const t = useTranslations()
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full bg-white flex flex-col">
      <form action={(a) => addPromotionCode(a)} className="w-full">
        <div className={`${paddingX} -mx-4 rounded-none`}>
          <div className="relative">
            <Input
              id="promotion-input"
              name="code"
              type="text"
              placeholder={t("checkout.promotionCode")}
              data-testid="discount-input"
              label={""}
            />
            <button
              type="submit"
              className="absolute right-2 top-3 bottom-1 px-6 text-[14px] font-medium bg-menubg text-white border-2 border-menubg rounded hover:opacity-80 transition-opacity"
              data-testid="discount-apply-button"
            >
              {t("common.add")}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-2">
            <ErrorMessage
              error={errorMessage}
              data-testid="discount-error-message"
            />
          </div>
        )}
      </form>

      {promotions.length > 0 && (
        <div className="w-full flex items-center mt-4">
          <div className="flex flex-col w-full">
            <Heading className="txt-medium mb-2">{t("checkout.promotionsApplied")}</Heading>

            {promotions.map((promotion) => {
              return (
                <div
                  key={promotion.id}
                  className="flex items-center justify-between w-full max-w-full mb-2"
                  data-testid="discount-row"
                >
                  <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                    <span className="truncate" data-testid="discount-code">
                      <Badge
                        color={promotion.is_automatic ? "green" : "grey"}
                        size="small"
                      >
                        {promotion.code}
                      </Badge>{" "}
                      (
                      {promotion.application_method?.value !== undefined &&
                        promotion.application_method.currency_code !==
                          undefined && (
                          <>
                            {promotion.application_method.type === "percentage"
                              ? `${promotion.application_method.value}%`
                              : convertToLocale({
                                  amount: +promotion.application_method.value,
                                  currency_code:
                                    promotion.application_method.currency_code,
                                })}
                          </>
                        )}
                      )
                    </span>
                  </Text>
                  {!promotion.is_automatic && (
                    <button
                      className="flex items-center"
                      onClick={() => {
                        if (!promotion.code) {
                          return
                        }

                        removePromotionCode(promotion.code)
                      }}
                      data-testid="remove-discount-button"
                    >
                      <Trash size={14} />
                      <span className="sr-only">
                        {t("checkout.removeDiscount")}
                      </span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountCode