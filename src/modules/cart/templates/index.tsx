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
    <div className="py-12 pt-3">
      <div className="content-container" data-testid="cart-container">
        <Breadcrumb lastLabel={t("common.cart")} />
        {banners && banners.length > 0 && (
          <div className="my-6">
            <BannerSection banners={banners} />
          </div>
        )}
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-8 mb-5 md:mb-0">
            <div className="flex flex-col bg-white py-6 gap-y-6 pt-3">
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12 md:pt-[63px]">
                {cart && cart.region && (
                  <>
                    <div className="bg-white">
                      <Summary cart={cart as any} customer={customer} />
                    </div>
                  </>
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
          <Reassurances language={countryCode} page_type="cart" />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
