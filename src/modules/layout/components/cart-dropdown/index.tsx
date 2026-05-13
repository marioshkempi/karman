"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import CartIcon from "@modules/common/icons/cart"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import DiscountCode from "@modules/checkout/components/discount-code"
import { useTranslations } from "next-intl"

const CartSideDrawer = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const t = useTranslations()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )

  const openDrawer = () => {
    setDrawerVisible(true)
    setTimeout(() => setDrawerOpen(true), 20)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => setDrawerVisible(false), 500)
  }

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    openDrawer()
    const timer = setTimeout(closeDrawer, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    openDrawer()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) clearTimeout(activeTimer)
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
      itemRef.current = totalItems
    }
  }, [totalItems, pathname])

  useEffect(() => {
    if (drawerVisible) {
      closeDrawer()
    }
  }, [pathname])

  return (
    <>
      <button
        onClick={openAndCancel}
        className="flex items-center gap-1.5 rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10 relative"
      >
        <CartIcon width={20} height={20} />
        <span className="bg-quaternary text-quinary text-[10px] rounded-full absolute -bottom-1.5 left-7 -translate-x-1/2 w-[20px] lg:w-[unset] lg:min-w-[16px] text-center px-1 py-0 md:static md:translate-x-0 md:text-[14px] md:min-w-0 md:px-2">
          {totalItems}
        </span>
      </button>

      {drawerVisible && (
        <div className="fixed inset-0 z-50">
          <div
            className={`fixed inset-0 bg-black/50 transition-opacity duration-500 ${
              drawerOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeDrawer}
          />
          <div
            className={`fixed right-0 top-0 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-500 ease-in-out ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col">
              <div className="bg-tertiary px-4 py-4 flex items-center justify-between">
                <h2 className="text-[18px] font-medium  uppercase">
                  {t("cart.cartDrawerTitle")} ({totalItems})
                </h2>
                <button
                  onClick={closeDrawer}
                  className=" hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {cartState && cartState.items?.length ? (
                  <div className="space-y-4">
                    {cartState.items
                      .sort((a, b) =>
                        (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                      )
                      .map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4">
                          <LocalizedClientLink
                            href={`/${item.product_handle}`}
                            className="w-20 flex-shrink-0 overflow-hidden"
                          >
                            <Image
                              src={
                                (item as any).variant?.thumbnail ||
                                item.thumbnail ||
                                "/placeholder.png"
                              }
                              alt={item.title || "Product image"}
                              width={80}
                              height={80}
                              className="object-cover object-center w-full h-full"
                            />
                          </LocalizedClientLink>

                          <div className="flex-1 flex flex-col ">
                            <div
                              className="flex items-center justify-between gap-2"
                              data-testid="product-name"
                            >
                              <LocalizedClientLink
                                href={`/${item.product_handle}`}
                              >
                                <h3 className="text-[14px] text-secondary leading-tight">
                                  {item.title}
                                  {item.variant?.title != "Default variant" &&
                                    item.variant?.title &&
                                    item.variant?.title &&
                                    ` - ${item.variant.title}`}
                                </h3>
                              </LocalizedClientLink>
                              <DeleteButton
                                id={item.id}
                                className="top-3 right-3"
                                data-testid="product-delete-button"
                              />
                            </div>
                            <div className="flex items-end justify-between mt-2">
                              <p className="text-[20px]  text-primary2">
                                <span className={"text-[18px]"}>
                                  {item.quantity}&nbsp;x&nbsp;
                                </span>
                                {convertToLocale({
                                  amount: item.unit_price || 0,
                                  currency_code: cartState.currency_code,
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-gray-900 text-white w-6 h-6 flex items-center justify-center rounded-full">
                      0
                    </div>
                    <span className="mt-4 text-gray-600">
                      {t("cart.emptyDrawer")}
                    </span>
                    <LocalizedClientLink href="/store">
                      <Button
                        onClick={closeDrawer}
                        className="mt-4 bg-primary shadow-none hover:bg-primary/90 transition-colors duration-300"
                      >
                        {t("cart.viewAllProducts")}
                      </Button>
                    </LocalizedClientLink>
                  </div>
                )}
              </div>

              {cartState?.items?.length ? (
                <div className="border-t border-gray-200 px-4 py-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[18px] text-primary">
                      {totalItems} {t("common.items")}
                    </p>
                    <p className="text-[18px]  text-primary2">
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[18px] text-primary">{t("cart.shipping")}</p>
                    <p className="text-[18px]  text-primary2">
                      {cartState.shipping_subtotal === 0
                        ? t("common.free")
                        : convertToLocale({
                            amount: cartState.shipping_subtotal ?? 0,
                            currency_code: cartState.currency_code,
                          })}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <p className="text-[18px]  text-primary">
                      {t("cart.totalWithTax")}
                    </p>
                    <p className="text-[18px]  text-primary2">
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div>
                      <DiscountCode cart={cartState} />
                    </div>

                    <LocalizedClientLink href="/cart" className="block py-1">
                      <button className="w-full py-3 px-2 text-[14px] font-medium text-white bg-primary rounded hover:bg-primary/90 transition-colors uppercase">
                        {t("cart.completePurchase")}
                      </button>
                    </LocalizedClientLink>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CartSideDrawer
