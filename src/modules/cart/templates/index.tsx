import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import Breadcrumb from "@modules/common/components/breadcrumb"
import Reassurances from "@modules/common/components/reassurances"
import BannerSection from "@modules/common/components/banner-section"
import { StoreBanner } from "@lib/data/banner"
import { getTranslations } from "next-intl/server"

const CartTemplate = async ({
  cart,
  customer,
  countryCode,
  banners,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  countryCode?: string
  banners?: StoreBanner[]
}) => {
  const t = await getTranslations()

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-6" data-testid="cart-container">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb lastLabel={t("common.cart")} />
        </div>

        {/* Page Title */}
        <h1 className="text-[24px] lg:text-[32px] font-bold text-[#1E3A5F] mb-6">
          {t("cart.shoppingCart")}
        </h1>

        {banners && banners.length > 0 && (
          <div className="mb-6">
            <BannerSection banners={banners} />
          </div>
        )}

        {cart?.items?.length ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left: Cart Items */}
            <div className="flex-1">
              <ItemsTemplate cart={cart} />
            </div>

            {/* Right: Summary */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="lg:sticky lg:top-6">
                {cart && cart.region && (
                  <Summary cart={cart as any} customer={customer} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}

        {countryCode && (
          <div className="mt-8">
            <Reassurances language={countryCode} page_type="cart" />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
