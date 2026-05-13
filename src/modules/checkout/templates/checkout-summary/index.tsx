import ItemsPreviewTemplate from "@modules/checkout/components/item-preview-template/preview"
import CartTotals from "@modules/checkout/components/cart-totals"
import { getTranslations } from "next-intl/server"

const CheckoutSummary = async ({ cart }: { cart: any }) => {
  const t = await getTranslations()

  return (
    <div className="w-full h-full flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0">
      <div className="w-full flex flex-col bg-lightyellow px-6 md:pr-30 py-4 h-full min-h-[700px]">
        <h2
          className="flex flex-row text-secondary text-2xl-regular font-black items-baseline"
        >
          {t("checkout.cartSummary")}
        </h2>
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
      </div>
    </div>
  )
}

export default CheckoutSummary
