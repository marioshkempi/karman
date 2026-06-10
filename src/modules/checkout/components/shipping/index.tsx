"use client"

import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx, Text } from "@medusajs/ui"
import CheckCircleSolid from "@modules/common/icons/check-circle-solid"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import BoxNowMap from "@modules/shipping/components/boxnow"
import AcsPointsMap from "@modules/shipping/components/acs-points-map"
import SlmMap from "@modules/shipping/components/slmshipping"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Truck, Store, Package } from "lucide-react"
import { useTranslations } from "next-intl"

// ─── Helpers ─────────────────────────────────────────────────

function parseSettingValue(val: any): any {
  if (!val) return null
  if (typeof val === "string") {
    try {
      return JSON.parse(val)
    } catch {
      return null
    }
  }
  return val
}

function getOptionMetadata(option: any) {
  const metadata = (option.metadata ?? {}) as Record<string, any>
  return {
    imageUrl:
      typeof metadata.image_url === "string" && metadata.image_url.trim()
        ? metadata.image_url
        : null,
    description:
      typeof metadata.description === "string" && metadata.description.trim()
        ? metadata.description
        : null,
  }
}

// ─── Sub-components ──────────────────────────────────────────

const CustomRadio = ({ checked }: { checked: boolean }) => (
  <div className="relative flex h-5 w-5 items-center justify-center flex-shrink-0">
    <div
      className={clx(
        "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
        {
          "border-primary bg-primary": checked,
          "border-gray-300 bg-transparent": !checked,
        }
      )}
    >
      {checked && <div className="h-2 w-2 rounded-full bg-white" />}
    </div>
  </div>
)

const OptionVisual = ({
  imageUrl,
  fallback,
  name,
}: {
  imageUrl: string | null
  fallback: React.ReactNode
  name: string
}) => {
  if (imageUrl) {
    return (
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md bg-white overflow-hidden border border-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    )
  }
  return <>{fallback}</>
}

const CarrierMapSelector = ({
  optionId,
  carrierIds,
  cartId,
  onSelect,
}: {
  optionId: string
  carrierIds: { boxnow: string | null; slm: string | null; acs: string | null }
  cartId: string
  onSelect: (id: string) => void
}) => {
  if (optionId === carrierIds.boxnow) {
    return <BoxNowMap cartid={cartId} onLockerSelect={onSelect} />
  }
  if (optionId === carrierIds.slm) {
    return (
      <SlmMap
        cartId={cartId}
        partnerId=""
        mapScriptUrl="https://sp.skroutzlastmile.gr/setup.js"
        onLockerSelect={onSelect}
      />
    )
  }
  if (optionId === carrierIds.acs) {
    return (
      <AcsPointsMap cartId={cartId} language="el" onPointSelect={onSelect} />
    )
  }
  return null
}

// ─── Types ───────────────────────────────────────────────────

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
  checkoutSettings: Record<string, any>
}

// ─── Main Component ──────────────────────────────────────────

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
  checkoutSettings,
}) => {
  // ── State ────────────────────────────────────────────────

  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )
  const [carrierSelection, setCarrierSelection] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "delivery"

  const getPathWithoutCountryCode = () => {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length > 1 && parts[0] && parts[0].length === 2) {
      return "/" + parts.slice(1).join("/")
    }
    return pathname
  }

  // ── Derived: carrier IDs from checkout settings ──────────

  const carrierIds = useMemo(() => {
    const boxnow = parseSettingValue(checkoutSettings?.BOXNOW_CARRIER_CONFIG)
    const slm = parseSettingValue(checkoutSettings?.SLMSHIPPING_CARRIER_CONFIG)
    const acs = parseSettingValue(checkoutSettings?.ACSPOINTS_CARRIER_CONFIG)

    return {
      boxnow: boxnow?.shippingOptionId || null,
      slm: slm?.shippingOptionId || null,
      acs: acs?.shippingOptionId || null,
    }
  }, [checkoutSettings])

  const carrierOptionIds = useMemo(() => {
    return new Set(
      [carrierIds.boxnow, carrierIds.slm, carrierIds.acs].filter(
        Boolean
      ) as string[]
    )
  }, [carrierIds])

  // ── Derived: shipping vs pickup methods ──────────────────

  const shippingMethods = useMemo(
    () =>
      availableShippingMethods?.filter(
        (sm: any) => sm.service_zone?.fulfillment_set?.type !== "pickup"
      ) ?? [],
    [availableShippingMethods]
  )

  const pickupMethods = useMemo(
    () =>
      availableShippingMethods?.filter(
        (sm: any) => sm.service_zone?.fulfillment_set?.type === "pickup"
      ) ?? [],
    [availableShippingMethods]
  )

  const hasPickupOptions = pickupMethods.length > 0

  const requiresPointSelection = shippingMethodId
    ? carrierOptionIds.has(shippingMethodId)
    : false

  const isSubmitDisabled =
    !cart.shipping_methods?.[0] ||
    isLoading ||
    (requiresPointSelection && !carrierSelection)

  // ── Effects ──────────────────────────────────────────────

  useEffect(() => {
    setIsLoadingPrices(true)

    const calculatedOptions = shippingMethods.filter(
      (sm) => sm.price_type === "calculated"
    )

    if (calculatedOptions.length) {
      Promise.allSettled(
        calculatedOptions.map((sm) =>
          calculatePriceForShippingOption(sm.id, cart.id, {
            option_id: sm.id,
          })
        )
      ).then((results) => {
        const pricesMap: Record<string, number> = {}

        results
          .filter(
            (r): r is PromiseFulfilledResult<any> => r.status === "fulfilled"
          )
          .forEach((r) => {
            if (r.value?.id) pricesMap[r.value.id] = r.value.amount!
          })

        setCalculatedPricesMap(pricesMap)
        setIsLoadingPrices(false)
      })
    } else {
      setIsLoadingPrices(false)
    }
  }, [availableShippingMethods])

  useEffect(() => {
    setError(null)
  }, [isOpen])

  // ── Handlers ─────────────────────────────────────────────

  const handleEdit = () => {
    router.push(getPathWithoutCountryCode() + "?step=delivery", {
      scroll: false,
    })
  }

  const handleSubmit = () => {
    router.push(getPathWithoutCountryCode() + "?step=payment", {
      scroll: false,
    })
  }

  const handleCarrierSelect = (id: string) => {
    setCarrierSelection(id)
  }

  const handleSetShippingMethod = async (id: string) => {
    setError(null)
    setCarrierSelection(null)

    const previousId = shippingMethodId
    setIsLoading(true)
    setShippingMethodId(id)

    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
    } catch (err: any) {
      setShippingMethodId(previousId)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Render helpers ───────────────────────────────────────

  const getCarrierIcon = (optionId: string) =>
    carrierOptionIds.has(optionId) ? (
      <Package className="w-5 h-5 text-gray-500" />
    ) : (
      <Truck className="w-5 h-5 text-gray-500" />
    )

  // @ts-ignore
  const isFreePrice = (option: HttpTypes.StoreCartShippingOption) =>
    (option.price_type === "flat" && option.amount === 0) ||
    // @ts-ignore
    calculatedPricesMap[option.id] === 0

  const formatShippingPrice = (option: HttpTypes.StoreCartShippingOption) => {
    if (option.price_type === "flat") {
      return option.amount === 0
        ? t("common.free")
        : convertToLocale({
            amount: option.amount!,
            currency_code: cart?.currency_code,
          })
    }

    // @ts-ignore
    if (calculatedPricesMap[option.id] !== undefined) {
      // @ts-ignore
      return calculatedPricesMap[option.id] === 0
        ? t("common.free")
        : convertToLocale({
            // @ts-ignore
            amount: calculatedPricesMap[option.id],
            currency_code: cart?.currency_code,
          })
    }

    if (isLoadingPrices) return <Loader />

    return "Δωρεάν"
  }

  const optionCardClass = (isSelected: boolean, isDisabled: boolean) =>
    clx("rounded-lg border-2 transition-all overflow-hidden", {
      "border-primary bg-primary/[0.03]": isSelected,
      "border-gray-200 bg-white hover:border-gray-300":
        !isSelected && !isDisabled,
      "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed": isDisabled,
    })

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="bg-white">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="flex flex-row text-[16px] lg:text-[20px] gap-x-2 items-center text-black font-bold">
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid className="text-primary w-4 h-4 lg:w-5 lg:h-5" />
          )}
          {t("checkout.delivery")}
        </h2>
        {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-black text-[14px] lg:text-base hover:opacity-80"
              data-testid="edit-delivery-button"
            >
              {t("common.edit")}
            </button>
          </Text>
        )}
      </div>

      {isOpen && (
        <>
          {/* ── Shipping Methods ────────────────────────── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-black" />
              <h3 className="text-[15px] lg:text-[17px] font-semibold text-black">
                {t("checkout.shipping")}
              </h3>
            </div>

            <div className="space-y-3">
              {shippingMethods.map((option) => {
                const isSelected = option.id === shippingMethodId
                const isCarrier = carrierOptionIds.has(option.id)
                const isDisabled =
                  option.price_type === "calculated" &&
                  !isLoadingPrices &&
                  // @ts-ignore
                  typeof calculatedPricesMap[option.id] !== "number"

                const { imageUrl, description } = getOptionMetadata(option)

                return (
                  <div
                    key={option.id}
                    className={optionCardClass(isSelected, isDisabled)}
                  >
                    {/* Option row */}
                    <div
                      onClick={() => {
                        if (!isDisabled) handleSetShippingMethod(option.id)
                      }}
                      className={clx(
                        "flex items-center justify-between py-3.5 lg:py-4 px-4 sm:px-5",
                        { "cursor-pointer": !isDisabled }
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CustomRadio checked={isSelected} />
                        <div className="flex items-center gap-2.5 min-w-0">
                          <OptionVisual
                            imageUrl={imageUrl}
                            fallback={getCarrierIcon(option.id)}
                            name={option.name}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[14px] lg:text-[15px] text-black font-medium truncate">
                              {option.name}
                            </span>
                            {description && (
                              <span className="text-[12px] lg:text-[13px] text-gray-500 mt-0.5 truncate">
                                {description}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={clx(
                          "text-[14px] lg:text-[15px] font-semibold ml-4 flex-shrink-0",
                          {
                            "text-green-600": isFreePrice(option),
                            "text-black": !isFreePrice(option),
                          }
                        )}
                      >
                        {formatShippingPrice(option)}
                      </span>
                    </div>

                    {/* Carrier picker (expanded when selected) */}
                    {isSelected && isCarrier && (
                      <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-gray-100">
                        <p className="text-[13px] text-gray-500 mb-3">
                          {t("checkout.selectPickupPoint")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <CarrierMapSelector
                            optionId={option.id}
                            carrierIds={carrierIds}
                            cartId={cart.id}
                            onSelect={handleCarrierSelect}
                          />
                        </div>
                        {carrierSelection && (
                          <div className="mt-3 flex items-center gap-2 text-[13px] text-green-600">
                            <CheckCircleSolid className="w-4 h-4" />
                            <span>{t("checkout.pickupPointSelected")}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Pickup Options ──────────────────────────── */}
          {hasPickupOptions && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-black" />
                <h3 className="text-[15px] lg:text-[17px] font-semibold text-black">
                  {t("checkout.pickupFromStore")}
                </h3>
              </div>

              <div className="space-y-3">
                {pickupMethods.map((option: any) => {
                  const isSelected = option.id === shippingMethodId
                  const isDisabled = option.insufficient_inventory
                  const address =
                    option.service_zone?.fulfillment_set?.location?.address

                  const { imageUrl, description } = getOptionMetadata(option)

                  return (
                    <div
                      key={option.id}
                      onClick={() => {
                        if (!isDisabled) handleSetShippingMethod(option.id)
                      }}
                      className={clx(
                        "rounded-lg border-2 transition-all py-3.5 lg:py-4 px-4 sm:px-5",
                        {
                          "border-primary bg-primary/[0.03] cursor-pointer":
                            isSelected,
                          "border-gray-200 bg-white hover:border-gray-300 cursor-pointer":
                            !isSelected && !isDisabled,
                          "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed":
                            isDisabled,
                        }
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="mt-0.5">
                            <CustomRadio checked={isSelected} />
                          </div>
                          {imageUrl && (
                            <OptionVisual
                              imageUrl={imageUrl}
                              fallback={null}
                              name={option.name}
                            />
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-[14px] lg:text-[15px] text-black font-medium">
                              {option.name}
                            </span>
                            {description && (
                              <span className="text-[12px] lg:text-[13px] text-gray-500 mt-0.5">
                                {description}
                              </span>
                            )}
                            {/*{address && (*/}
                            {/*  <span className="text-[13px] text-gray-500 mt-0.5">*/}
                            {/*    {address.address_1}*/}
                            {/*    {address.city && `, ${address.city}`}*/}
                            {/*  </span>*/}
                            {/*)}*/}
                          </div>
                        </div>
                        <span
                          className={clx(
                            "text-[14px] lg:text-[15px] font-semibold ml-4 flex-shrink-0",
                            {
                              "text-green-600": option.amount === 0,
                              "text-black": option.amount !== 0,
                            }
                          )}
                        >
                          {option.amount === 0
                            ? t("common.free")
                            : convertToLocale({
                                amount: option.amount!,
                                currency_code: cart?.currency_code,
                              })}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Submit ──────────────────────────────────── */}
          <ErrorMessage
            error={error}
            data-testid="delivery-option-error-message"
          />

          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-[#FF8C00] text-white text-[14px] sm:text-[15px] font-semibold hover:bg-[#E67E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
            data-testid="submit-delivery-option-button"
          >
            {isLoading ? t("common.loading") : t("checkout.continueToPayment")}
          </button>
        </>
      )}

      <Divider className="mt-8" />
    </div>
  )
}

export default Shipping
